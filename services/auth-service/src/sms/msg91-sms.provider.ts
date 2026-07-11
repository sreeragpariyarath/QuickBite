import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SmsProvider } from './sms.provider';

/**
 * Sends OTP SMS through MSG91's SendOTP API (/api/v5/otp).
 *
 * We pass our own generated OTP, so verification stays in our OtpService
 * (hash compare) — MSG91 is delivery only.
 *
 * Required env:
 *   MSG91_AUTH_KEY    — account auth key (MSG91 dashboard → Authkey)
 * Optional env:
 *   MSG91_TEMPLATE_ID — your DLT-approved OTP template id. When empty,
 *                       MSG91's default OTP template is used, which works
 *                       for trial accounts sending to the account's own
 *                       verified number before DLT registration is done.
 */
@Injectable()
export class Msg91SmsProvider implements SmsProvider {
  private readonly logger = new Logger(Msg91SmsProvider.name);
  readonly deliversRealSms = true;

  async sendOtp(phone: string, otp: string): Promise<void> {
    const params = new URLSearchParams({
      mobile: phone.replace('+', ''),
      otp,
      otp_expiry: '5',
    });
    if (process.env.MSG91_TEMPLATE_ID) {
      params.set('template_id', process.env.MSG91_TEMPLATE_ID);
    }

    const response = await fetch(
      `https://control.msg91.com/api/v5/otp?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: process.env.MSG91_AUTH_KEY as string,
        },
      },
    );

    const body = await response.text();
    if (!response.ok) {
      this.logger.error(`MSG91 request failed (${response.status}): ${body}`);
      throw new ServiceUnavailableException('Could not send OTP, try again');
    }

    let result: { type?: string; message?: string };
    try {
      result = JSON.parse(body) as { type?: string; message?: string };
    } catch {
      result = {};
    }
    if (result.type !== 'success') {
      this.logger.error(`MSG91 rejected the message: ${body}`);
      throw new ServiceUnavailableException('Could not send OTP, try again');
    }

    this.logger.log(`OTP SMS dispatched to ${phone} via MSG91`);
  }
}
