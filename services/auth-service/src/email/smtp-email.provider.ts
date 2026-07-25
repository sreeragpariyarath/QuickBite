import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailProvider } from './email.provider';

/**
 * Sends email through standard SMTP (configured primarily for Google Gmail).
 *
 * Required env:
 *   SMTP_USER — Gmail/SMTP user email (e.g. psreerag69@gmail.com)
 *   SMTP_PASS — Gmail App Password (requires Google Account 2-Step Verification)
 * Optional env:
 *   SMTP_HOST — defaults to 'smtp.gmail.com'
 *   SMTP_PORT — defaults to 465 (secure SSL/TLS)
 *   EMAIL_FROM — defaults to QuickBite <SMTP_USER>
 */
@Injectable()
export class SmtpEmailProvider implements EmailProvider {
  private readonly logger = new Logger(SmtpEmailProvider.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  get deliversRealEmail(): boolean {
    return true;
  }

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    const defaultFrom = `QuickBite <${process.env.SMTP_USER}>`;
    const from = process.env.EMAIL_FROM || defaultFrom;

    const mailOptions = {
      from,
      to,
      subject: 'Verify your QuickBite email',
      html: this.template(verifyUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification email successfully sent to ${to} via SMTP`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to} via SMTP:`, error);
      throw new ServiceUnavailableException(
        'Could not send verification email, try again',
      );
    }
  }

  private template(verifyUrl: string): string {
    return `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
  <h2 style="color:#0d9488">QuickBite</h2>
  <p>Confirm your email address to finish setting up your QuickBite account.</p>
  <p style="margin:32px 0">
    <a href="${verifyUrl}"
       style="background:#0d9488;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block">
      Verify Email
    </a>
  </p>
  <p style="color:#666;font-size:13px">This link expires in 24 hours. If you didn't create a QuickBite account, ignore this email.</p>
</div>`;
  }
}
