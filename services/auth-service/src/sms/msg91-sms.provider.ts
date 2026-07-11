import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SmsProvider } from './sms.provider';

/**
 * Sends OTP SMS through MSG91's Flow API using a DLT-approved template.
 *
 * Required env:
 *   MSG91_AUTH_KEY    — account auth key (MSG91 dashboard → Authkey)
 *   MSG91_TEMPLATE_ID — DLT-approved flow/template id containing an ##otp## variable
 */
@Injectable()
export class Msg91SmsProvider implements SmsProvider {
  private readonly logger = new Logger(Msg91SmsProvider.name);
  readonly deliversRealSms = true;

  async sendOtp(phone: string, otp: string): Promise<void> {
    const response = await fetch('https://control.msg91.com/api/v5/flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: process.env.MSG91_AUTH_KEY as string,
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        recipients: [
          {
            mobiles: phone.replace('+', ''),
            otp,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`MSG91 request failed (${response.status}): ${body}`);
      throw new ServiceUnavailableException('Could not send OTP, try again');
    }

    const result = (await response.json()) as { type?: string };
    if (result.type !== 'success') {
      this.logger.error(`MSG91 rejected the message: ${JSON.stringify(result)}`);
      throw new ServiceUnavailableException('Could not send OTP, try again');
    }
  }
}
