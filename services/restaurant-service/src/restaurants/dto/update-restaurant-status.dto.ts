import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum RestaurantStatusEnum {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export class UpdateRestaurantStatusDto {
  @ApiProperty({ enum: RestaurantStatusEnum, example: 'ACTIVE' })
  @IsEnum(RestaurantStatusEnum)
  status: RestaurantStatusEnum;
}
