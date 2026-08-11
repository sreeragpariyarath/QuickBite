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

  @ApiProperty({ example: 'Kochi', minLength: 2 })
  @IsString()
  @MinLength(2)
  city: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/restaurant.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: '12345678901234' })
  @IsOptional()
  @IsString()
  fssaiLicense?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: '29ABCDE1234F1Z5' })
  @IsOptional()
  @IsString()
  gstin?: string;
}
