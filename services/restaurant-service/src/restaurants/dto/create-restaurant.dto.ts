import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MinLength(5)
  address: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
