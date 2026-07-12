import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { UserRole } from '@prisma-app/client';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+919876543210',
    description: 'Indian mobile number in +91XXXXXXXXXX format',
  })
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'phone must be a valid Indian number in +91XXXXXXXXXX format',
  })
  phone: string;

  @ApiProperty({ example: '123456', description: '6-digit code from SMS' })
  @Matches(/^\d{6}$/, { message: 'otp must be a 6-digit code' })
  @Length(6, 6)
  otp: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.CUSTOMER,
    description: 'Applied only when the phone is not registered yet',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
