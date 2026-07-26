import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { EMAIL_PROVIDER, EmailProvider } from '../email/email.provider';

const TOKEN_TTL_MINUTES = 60;
const RESEND_COOLDOWN_SECONDS = 60;
const SALT_ROUNDS = 10;

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(EMAIL_PROVIDER) private readonly email: EmailProvider,
  ) {}

  async requestReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('No account found with this email');
    }

    // Check resend cooldown
    const latest = await this.prisma.passwordResetToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    if (
      latest &&
      Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_SECONDS * 1000
    ) {
      throw new HttpException(
        'Reset email already sent — wait 60 seconds before retrying',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Delete any old tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create fresh token
    const token = randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hash(token),
        expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000),
      },
    });

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3100';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.email.sendPasswordResetEmail(email, resetUrl);

    return this.email.deliversRealEmail ? {} : { devResetUrl: resetUrl };
  }

  async confirmReset(token: string, newPassword: string) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: this.hash(token) },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Reset link is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.deleteMany({
        where: { userId: record.userId },
      }),
    ]);

    return { message: 'Password reset successful' };
  }

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
