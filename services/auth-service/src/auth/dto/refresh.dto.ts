import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefreshDto {
  @ApiPropertyOptional({
    example: '1961487d8735bfc171879d604d7cae57ab6b8c25c246c5d5…',
    description:
      'Opaque refresh token from login or OTP verify. Optional when the refresh_token HttpOnly cookie is present.',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
