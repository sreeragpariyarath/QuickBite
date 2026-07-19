import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateMeDto {
  @ApiProperty({ example: 'Sreerag P', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;
}
