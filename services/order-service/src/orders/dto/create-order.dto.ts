import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemInputDto {
  @ApiProperty({ format: 'uuid', description: 'Menu item to order' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ example: 2, minimum: 1, maximum: 50 })
  @IsInt()
  @Min(1)
  @Max(50)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ format: 'uuid', description: 'Restaurant to order from' })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ type: [OrderItemInputDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}
