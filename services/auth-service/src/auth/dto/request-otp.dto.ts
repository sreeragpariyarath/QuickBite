import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({
    example: '+919876543210',
    description: 'Indian mobile number in +91XXXXXXXXXX format',
  })
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'phone must be a valid Indian number in +91XXXXXXXXXX format',
  })
  phone: string;
}
