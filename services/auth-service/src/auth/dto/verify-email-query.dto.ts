import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VerifyEmailQueryDto {
  @ApiProperty({ description: 'Raw verification token from the email link' })
  @IsString()
  @MinLength(32)
  token: string;
}
