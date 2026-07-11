export const SMS_PROVIDER = 'SMS_PROVIDER';

export interface SmsProvider {
  /** Sends an OTP to the given E.164 phone number. Throws on delivery failure. */
  sendOtp(phone: string, otp: string): Promise<void>;
  /** True when this provider actually delivers SMS (false for the dev console provider). */
  readonly deliversRealSms: boolean;
}
