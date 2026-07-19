import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateRestaurantDto {
  @ApiPropertyOptional({ example: 'Spice Garden', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: 'Now with tandoor specials' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '123 Main Street, Kochi', minLength: 5 })
  @IsOptional()
  @IsString()
  @MinLength(5)
  address?: string;

  @ApiPropertyOptional({ example: 'Kochi', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  city?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/restaurant.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: true, description: 'Hide/show in listings' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
