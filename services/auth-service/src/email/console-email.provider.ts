import { Injectable, Logger } from '@nestjs/common';
import { EmailProvider } from './email.provider';

/**
 * Development fallback used when RESEND_API_KEY is not configured.
 * Logs the verification URL instead of sending an email.
 */
@Injectable()
export class ConsoleEmailProvider implements EmailProvider {
  private readonly logger = new Logger(ConsoleEmailProvider.name);
  readonly deliversRealEmail = false;

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    this.logger.warn(`[DEV EMAIL] Verification link for ${to}: ${verifyUrl}`);
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    this.logger.warn(`[DEV EMAIL] Password reset link for ${to}: ${resetUrl}`);
  }
}
