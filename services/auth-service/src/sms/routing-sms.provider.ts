import { Injectable, Logger } from '@nestjs/common';
import { SmsDispatchResult, SmsProvider } from './sms.provider';

/**
 * Routes real SMS only to allowlisted numbers (SMS_LIVE_NUMBERS);
 * everyone else gets the dev fallback (console log + devOtp in response).
 *
 * Purpose: MSG91 trial accounts deliver only to the account's verified
 * number — this keeps development unblocked for all other numbers until
 * DLT registration unlocks unrestricted delivery.
 */
@Injectable()
export class RoutingSmsProvider implements SmsProvider {
  private readonly logger = new Logger(RoutingSmsProvider.name);

  constructor(
    private readonly live: SmsProvider,
    private readonly fallback: SmsProvider,
    private readonly liveNumbers: string[],
  ) {}

  async sendOtp(phone: string, otp: string): Promise<SmsDispatchResult> {
    if (this.liveNumbers.includes(phone)) {
      return this.live.sendOtp(phone, otp);
    }
    this.logger.log(`${phone} not in SMS_LIVE_NUMBERS — using dev fallback`);
    return this.fallback.sendOtp(phone, otp);
  }
}
