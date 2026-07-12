import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Main Course', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;
}
