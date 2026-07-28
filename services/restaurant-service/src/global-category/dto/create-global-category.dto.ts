import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateGlobalCategoryDto {
  @ApiProperty({ example: 'Burgers', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/burgers.png',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
