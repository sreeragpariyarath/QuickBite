import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Butter Chicken', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Creamy tomato-based curry' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 250.0, description: 'Price in INR, max 2 decimals' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Category to place the item under',
  })
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
    description: 'Whether the dish is available for ordering',
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
