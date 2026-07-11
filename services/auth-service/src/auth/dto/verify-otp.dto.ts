import { IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { UserRole } from '@prisma-app/client';

export class VerifyOtpDto {
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'phone must be a valid Indian number in +91XXXXXXXXXX format',
  })
  phone: string;

  @Matches(/^\d{6}$/, { message: 'otp must be a 6-digit code' })
  @Length(6, 6)
  otp: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
