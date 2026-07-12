import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { User } from '@prisma-app/client';
import { PrismaService } from '../prisma/prisma.service';
import { EMAIL_PROVIDER, EmailProvider } from '../email/email.provider';

const TOKEN_TTL_HOURS = 24;
const RESEND_COOLDOWN_SECONDS = 60;

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(EMAIL_PROVIDER) private readonly email: EmailProvider,
  ) {}

  /**
   * Issues a fresh verification token for the user and emails the link.
   * Enforces a 60-second cooldown between issues per user.
   * Returns the dev verification URL when running with the console provider.
   */
  async issue(userId: string, emailAddress: string) {
    const latest = await this.prisma.emailVerificationToken.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (
      latest &&
      Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_SECONDS * 1000
    ) {
      throw new HttpException(
        'Verification email already sent — wait 60 seconds before retrying',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.prisma.emailVerificationToken.deleteMany({ where: { userId } });

    const token = randomBytes(32).toString('hex');
    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash: this.hash(token),
        expiresAt: new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000),
      },
    });

    const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}`;

    await this.email.sendVerificationEmail(emailAddress, verifyUrl);

    return this.email.deliversRealEmail ? {} : { devVerificationUrl: verifyUrl };
  }

  /**
   * Validates and consumes a verification token.
   * Marks the user's email verified and deletes the user's tokens.
   * Returns the verified user.
   */
  async consume(token: string): Promise<User> {
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash: this.hash(token) },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException(
        'Verification link is invalid or expired',
      );
    }
    if (record.user.isEmailVerified) {
      await this.prisma.emailVerificationToken.deleteMany({
        where: { userId: record.userId },
      });
      throw new UnauthorizedException('Email is already verified');
    }

    const user = await this.prisma.user.update({
      where: { id: record.userId },
      data: { isEmailVerified: true },
    });
    await this.prisma.emailVerificationToken.deleteMany({
      where: { userId: record.userId },
    });

    return user;
  }

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
