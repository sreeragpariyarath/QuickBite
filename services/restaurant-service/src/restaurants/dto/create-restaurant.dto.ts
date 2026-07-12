import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Spice Garden', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Authentic Indian cuisine' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123 Main Street, Kochi', minLength: 5 })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/restaurant.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
