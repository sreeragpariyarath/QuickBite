import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    example: '1961487d8735bfc171879d604d7cae57ab6b8c25c246c5d5…',
    description: 'Opaque refresh token returned by login or OTP verify',
  })
  @IsString()
  refreshToken: string;
}
