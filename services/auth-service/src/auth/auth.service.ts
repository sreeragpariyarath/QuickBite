import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailVerificationService } from './email-verification.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { RegisterEmailDto } from './dto/register-email.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AttachEmailDto } from './dto/attach-email.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailVerification: EmailVerificationService,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  // ---------- Phone OTP (primary) ----------

  async verifyOtp(dto: VerifyOtpDto) {
    let decodedToken;
    try {
      decodedToken = await this.firebaseAdmin.verifyIdToken(dto.firebaseToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }

    const phone = decodedToken.phone_number;
    if (!phone) {
      throw new BadRequestException('Token does not contain a verified phone number');
    }

    let user = await this.prisma.user.findUnique({
      where: { phone },
    });
    const isNewUser = !user;

    if (!user) {
      user = await this.prisma.user.create({
        data: { phone, role: dto.role ?? 'CUSTOMER' },
      });
    }

    const accessToken = await this.signAccessToken(user.id, user.role);
    const refreshToken = await this.issueRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      isNewUser,
      user: { id: user.id, phone: user.phone, role: user.role },
    };
  }

  // ---------- Email + password (secondary) ----------

  async registerEmail(dto: RegisterEmailDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await bcrypt.hash(dto.password, SALT_ROUNDS),
        role: dto.role ?? 'CUSTOMER',
        isEmailVerified: false,
      },
    });

    const dev = await this.emailVerification.issue(user.id, dto.email);

    return { message: 'Verification email sent.', ...dev };
  }

  async loginEmail(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new ConflictException('Please verify your email.');
    }

    const accessToken = await this.signAccessToken(user.id, user.role);
    const refreshToken = await this.issueRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  /**
   * Consumes a verification token. For email-first users (no phone) a login
   * session is created (Case 1); phone users already have a session (Case 2).
   */
  async verifyEmail(token: string) {
    const user = await this.emailVerification.consume(token);

    if (user.phone) {
      return { autoLogin: false as const };
    }

    return {
      autoLogin: true as const,
      accessToken: await this.signAccessToken(user.id, user.role),
      refreshToken: await this.issueRefreshToken(user.id),
    };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('No account with this email');
    }
    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    const dev = await this.emailVerification.issue(user.id, email);

    return { message: 'Verification email sent.', ...dev };
  }

  async attachEmail(userId: string, dto: AttachEmailDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    if (user.email) {
      throw new ConflictException('This account already has an email');
    }

    const emailTaken = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (emailTaken) {
      throw new ConflictException('Email already registered');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: dto.email,
        isEmailVerified: false,
        // Never overwrite an existing password via this endpoint
        ...(user.password
          ? {}
          : { password: await bcrypt.hash(dto.password, SALT_ROUNDS) }),
      },
    });

    const dev = await this.emailVerification.issue(userId, dto.email);

    return { message: 'Verification email sent.', ...dev };
  }

  // ---------- Profile ----------

  private readonly profileSelect = {
    id: true,
    phone: true,
    email: true,
    isEmailVerified: true,
    name: true,
    role: true,
    createdAt: true,
  } as const;

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.profileSelect,
    });
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return user;
  }

  updateMe(userId: string, data: { name: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: this.profileSelect,
    });
  }

  // ---------- Tokens ----------

  async refresh(refreshToken: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token: this.hashToken(refreshToken) },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const accessToken = await this.signAccessToken(
      record.user.id,
      record.user.role,
    );

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: this.hashToken(refreshToken) },
    });

    return { message: 'Logged out successfully' };
  }

  private signAccessToken(userId: string, role: string) {
    return this.jwtService.signAsync({ sub: userId, role });
  }

  private async issueRefreshToken(userId: string) {
    const token = randomBytes(48).toString('hex');
    const days = Number(process.env.REFRESH_EXPIRES_IN_DAYS ?? 7);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        token: this.hashToken(token),
        userId,
        expiresAt,
      },
    });

    return token;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
