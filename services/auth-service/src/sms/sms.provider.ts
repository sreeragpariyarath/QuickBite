export const SMS_PROVIDER = 'SMS_PROVIDER';

export interface SmsDispatchResult {
  /** True when a real SMS was dispatched (vs dev logging). */
  realSms: boolean;
}

export interface SmsProvider {
  /** Sends an OTP to the given E.164 phone number. Throws on delivery failure. */
  sendOtp(phone: string, otp: string): Promise<SmsDispatchResult>;
}
