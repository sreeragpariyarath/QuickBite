import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RestaurantClient } from './restaurant.client';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, RestaurantClient],
})
export class OrdersModule {}
