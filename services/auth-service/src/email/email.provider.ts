export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';

export interface EmailProvider {
  /** Sends the verification email. Throws on delivery failure. */
  sendVerificationEmail(to: string, verifyUrl: string): Promise<void>;
  /** True when this provider actually delivers email (false for the dev console provider). */
  readonly deliversRealEmail: boolean;
}
