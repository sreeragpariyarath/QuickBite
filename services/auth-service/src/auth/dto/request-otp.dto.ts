import { Matches } from 'class-validator';

export class RequestOtpDto {
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'phone must be a valid Indian number in +91XXXXXXXXXX format',
  })
  phone: string;
}
