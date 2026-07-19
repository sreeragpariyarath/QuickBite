import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderStatus } from '@prisma-app/client';
import { PrismaService } from '../prisma/prisma.service';
import { RestaurantClient } from './restaurant.client';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtPayload } from '../auth/jwt-auth.guard';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly restaurantClient: RestaurantClient,
  ) {}

  async create(customerId: string, dto: CreateOrderDto) {
    const restaurant = await this.restaurantClient.getRestaurant(
      dto.restaurantId,
    );
    if (!restaurant.isActive) {
      throw new BadRequestException('Restaurant is not accepting orders');
    }

    const menuById = new Map(restaurant.menuItems.map((m) => [m.id, m]));

    const items = dto.items.map((item) => {
      const menuItem = menuById.get(item.menuItemId);
      if (!menuItem) {
        throw new BadRequestException(
          `Menu item ${item.menuItemId} is not available in this restaurant`,
        );
      }
      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      };
    });

    const total =
      Math.round(
        items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100,
      ) / 100;

    return this.prisma.order.create({
      data: {
        customerId,
        restaurantId: restaurant.id,
        ownerId: restaurant.ownerId,
        total,
        items: { create: items },
      },
      include: { items: true },
    });
  }

  findAllFor(user: JwtPayload) {
    const where =
      user.role === 'OWNER' ? { ownerId: user.sub } : { customerId: user.sub };

    return this.prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneFor(id: string, user: JwtPayload) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.customerId !== user.sub && order.ownerId !== user.sub) {
      throw new ForbiddenException('This is not your order');
    }

    return order;
  }

  accept(id: string, user: JwtPayload) {
    return this.transition(id, user, 'owner', ['PENDING'], 'ACCEPTED');
  }

  reject(id: string, user: JwtPayload) {
    return this.transition(id, user, 'owner', ['PENDING'], 'REJECTED');
  }

  prepare(id: string, user: JwtPayload) {
    return this.transition(id, user, 'owner', ['ACCEPTED'], 'PREPARING');
  }

  async deliver(id: string, user: JwtPayload) {
    const order = await this.transition(
      id,
      user,
      'owner',
      ['PREPARING'],
      'DELIVERED',
    );
    // COD is collected on delivery
    return this.prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'PAID' },
      include: { items: true },
    });
  }

  cancel(id: string, user: JwtPayload) {
    return this.transition(
      id,
      user,
      'customer',
      ['PENDING', 'ACCEPTED'],
      'CANCELLED',
    );
  }

  private async transition(
    id: string,
    user: JwtPayload,
    actor: 'owner' | 'customer',
    allowedFrom: OrderStatus[],
    to: OrderStatus,
  ): Promise<Order & { items: unknown[] }> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const actorId = actor === 'owner' ? order.ownerId : order.customerId;
    if (actorId !== user.sub) {
      throw new ForbiddenException(
        actor === 'owner'
          ? 'This order does not belong to your restaurant'
          : 'This is not your order',
      );
    }

    if (!allowedFrom.includes(order.status)) {
      throw new BadRequestException(
        `Cannot move order from ${order.status} to ${to}`,
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: to },
      include: { items: true },
    });
  }
}
