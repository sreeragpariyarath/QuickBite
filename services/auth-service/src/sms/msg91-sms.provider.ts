import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SmsDispatchResult, SmsProvider } from './sms.provider';

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Sends OTP SMS through MSG91's SendOTP API (/api/v5/otp).
 *
 * We pass our own generated OTP, so verification stays in our OtpService
 * (hash compare) — MSG91 is delivery only.
 *
 * IMPORTANT (audit 2026-07-13): the API returns {type:"success"} synchronously
 * even when the message can never be dispatched. Per MSG91 docs, template_id
 * is REQUIRED for actual SMS delivery, and creating a template requires a
 * Sender ID, which requires DLT registration (business KYC). Without those,
 * requests are accepted and the OTP is stored on MSG91's side, but no SMS
 * leaves their platform. Delivery failures are visible only in the dashboard
 * (SendOTP → Logs → Failed/All) or via webhooks.
 *
 * Required env:
 *   MSG91_AUTH_KEY    — account Authkey (dashboard top-right → AuthKey; NOT an
 *                       OTP Widget token)
 *   MSG91_TEMPLATE_ID — DLT-approved OTP template id (required for delivery)
 */
@Injectable()
export class Msg91SmsProvider implements SmsProvider {
  private readonly logger = new Logger(Msg91SmsProvider.name);

  async sendOtp(phone: string, otp: string): Promise<SmsDispatchResult> {
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
          authkey: process.env.MSG91_AUTH_KEY as string,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    const body = await response.text();
    if (!response.ok) {
      this.logger.error(`MSG91 request failed (${response.status}): ${body}`);
      throw new ServiceUnavailableException('Could not send OTP, try again');
    }

    let result: { type?: string; request_id?: string; message?: string };
    try {
      result = JSON.parse(body) as {
        type?: string;
        request_id?: string;
        message?: string;
      };
    } catch {
      result = {};
    }
    if (result.type !== 'success') {
      this.logger.error(`MSG91 rejected the message: ${body}`);
      throw new ServiceUnavailableException('Could not send OTP, try again');
    }

    this.logger.log(
      `OTP SMS accepted by MSG91 for ${phone} (request_id: ${result.request_id ?? 'n/a'}) — delivery depends on account DLT/template status`,
    );
    return { realSms: true };
  }
}
