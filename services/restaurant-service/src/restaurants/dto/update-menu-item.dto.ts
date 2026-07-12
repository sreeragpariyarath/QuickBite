import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateMenuItemDto {
  @ApiPropertyOptional({ example: 'Butter Chicken', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: 'Creamy tomato-based curry' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 275.5, description: 'Price in INR' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/butter-chicken.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Sold-out items stay on the menu but hidden from customers',
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
