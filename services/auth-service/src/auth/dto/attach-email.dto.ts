import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AttachEmailDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    minLength: 8,
    description:
      'Sets the account password so email login works. Ignored if the account already has a password.',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
