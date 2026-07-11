import { Injectable, Logger } from '@nestjs/common';
import { SmsProvider } from './sms.provider';

/**
 * Development fallback used when MSG91 credentials are not configured.
 * Logs the OTP instead of sending an SMS.
 */
@Injectable()
export class ConsoleSmsProvider implements SmsProvider {
  private readonly logger = new Logger(ConsoleSmsProvider.name);
  readonly deliversRealSms = false;

  async sendOtp(phone: string, otp: string): Promise<void> {
    this.logger.warn(`[DEV SMS] OTP for ${phone}: ${otp}`);
  }
}
