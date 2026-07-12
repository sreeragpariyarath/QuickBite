import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SMS_PROVIDER, SmsProvider } from '../sms/sms.provider';

const OTP_TTL_MINUTES = 5;
const MAX_REQUESTS_PER_WINDOW = 3;
const REQUEST_WINDOW_MINUTES = 15;
const MAX_VERIFY_ATTEMPTS = 5;

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SMS_PROVIDER) private readonly sms: SmsProvider,
  ) {}

  async request(phone: string) {
    const windowStart = new Date(
      Date.now() - REQUEST_WINDOW_MINUTES * 60 * 1000,
    );
    const recentCount = await this.prisma.otp.count({
      where: { phone, createdAt: { gte: windowStart } },
    });
    if (recentCount >= MAX_REQUESTS_PER_WINDOW) {
      throw new HttpException(
        `Too many OTP requests — try again in ${REQUEST_WINDOW_MINUTES} minutes`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await this.prisma.otp.deleteMany({
      where: { phone, expiresAt: { lt: new Date() } },
    });
    await this.prisma.otp.create({
      data: { phone, codeHash: this.hash(code), expiresAt },
    });

    const { realSms } = await this.sms.sendOtp(phone, code);

    return {
      message: 'OTP sent',
      expiresInSeconds: OTP_TTL_MINUTES * 60,
      // Exposed only when no real SMS was dispatched (dev fallback), so the
      // flow stays testable for numbers MSG91 cannot deliver to yet.
      ...(realSms ? {} : { devOtp: code }),
    };
  }

  /**
   * Validates the OTP for the phone. Throws on failure.
   * Consumes all OTPs for the phone on success.
   */
  async assertValid(phone: string, code: string): Promise<void> {
    const otp = await this.prisma.otp.findFirst({
      where: { phone, expiresAt: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('OTP expired or not requested');
    }
    if (otp.attempts >= MAX_VERIFY_ATTEMPTS) {
      await this.prisma.otp.deleteMany({ where: { phone } });
      throw new UnauthorizedException(
        'Too many wrong attempts — request a new OTP',
      );
    }

    if (otp.codeHash !== this.hash(code)) {
      await this.prisma.otp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.prisma.otp.deleteMany({ where: { phone } });
  }

  private hash(code: string) {
    return createHash('sha256').update(code).digest('hex');
  }
}
