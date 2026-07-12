import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { EmailProvider } from './email.provider';

/**
 * Sends email through Resend's REST API.
 *
 * Required env:
 *   RESEND_API_KEY — from https://resend.com (free tier: 3,000 emails/month)
 * Optional env:
 *   EMAIL_FROM — sender identity; defaults to Resend's test sender, which
 *                delivers only to the Resend account owner's email until a
 *                domain is verified.
 */
@Injectable()
export class ResendEmailProvider implements EmailProvider {
  private readonly logger = new Logger(ResendEmailProvider.name);
  readonly deliversRealEmail = true;

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'QuickBite <onboarding@resend.dev>',
        to: [to],
        subject: 'Verify your QuickBite email',
        html: this.template(verifyUrl),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Resend request failed (${response.status}): ${body}`);
      throw new ServiceUnavailableException(
        'Could not send verification email, try again',
      );
    }
  }

  private template(verifyUrl: string): string {
    return `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
  <h2 style="color:#e23744">QuickBite</h2>
  <p>Confirm your email address to finish setting up your QuickBite account.</p>
  <p style="margin:32px 0">
    <a href="${verifyUrl}"
       style="background:#e23744;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block">
      Verify Email
    </a>
  </p>
  <p style="color:#666;font-size:13px">This link expires in 24 hours. If you didn't create a QuickBite account, ignore this email.</p>
</div>`;
  }
}
