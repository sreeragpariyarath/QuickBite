import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- Restaurants ----------

  async create(ownerId: string, dto: CreateRestaurantDto) {
    try {
      return await this.prisma.restaurant.create({
        data: { ...dto, ownerId },
      });
    } catch (err) {
      this.rethrowDuplicate(err);
    }
  }

  findAll(city?: string) {
    return this.prisma.restaurant.findMany({
      where: {
        isActive: true,
        ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            menuItems: { where: { isAvailable: true } },
          },
        },
        menuItems: {
          where: { isAvailable: true, categoryId: null },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async update(id: string, ownerId: string, dto: UpdateRestaurantDto) {
    await this.assertOwnership(id, ownerId);

    try {
      return await this.prisma.restaurant.update({
        where: { id },
        data: dto,
      });
    } catch (err) {
      this.rethrowDuplicate(err);
    }
  }

  /** Maps the (ownerId, name, address) unique violation (P2002) to a 409. */
  private rethrowDuplicate(err: unknown): never {
    const code =
      typeof err === 'object' && err !== null
        ? (err as { code?: string }).code
        : undefined;
    if (code === 'P2002') {
      throw new ConflictException(
        'You already have a restaurant with this name at this address',
      );
    }
    throw err;
  }

  // ---------- Categories ----------

  async addCategory(
    restaurantId: string,
    ownerId: string,
    dto: CreateCategoryDto,
  ) {
    await this.assertOwnership(restaurantId, ownerId);

    return this.prisma.category.create({
      data: { ...dto, restaurantId },
    });
  }

  // ---------- Menu Items ----------

  async addMenuItem(
    restaurantId: string,
    ownerId: string,
    dto: CreateMenuItemDto,
  ) {
    await this.assertOwnership(restaurantId, ownerId);

    if (dto.categoryId) {
      await this.assertCategoryInRestaurant(dto.categoryId, restaurantId);
    }

    return this.prisma.menuItem.create({
      data: { ...dto, restaurantId },
    });
  }

  async updateMenuItem(
    restaurantId: string,
    itemId: string,
    ownerId: string,
    dto: UpdateMenuItemDto,
  ) {
    await this.assertOwnership(restaurantId, ownerId);
    await this.assertMenuItemInRestaurant(itemId, restaurantId);

    if (dto.categoryId) {
      await this.assertCategoryInRestaurant(dto.categoryId, restaurantId);
    }

    return this.prisma.menuItem.update({
      where: { id: itemId },
      data: dto,
    });
  }

  async removeMenuItem(restaurantId: string, itemId: string, ownerId: string) {
    await this.assertOwnership(restaurantId, ownerId);
    await this.assertMenuItemInRestaurant(itemId, restaurantId);

    await this.prisma.menuItem.delete({ where: { id: itemId } });
  }

  // ---------- Guards ----------

  private async assertOwnership(restaurantId: string, ownerId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this restaurant');
    }
  }

  private async assertCategoryInRestaurant(
    categoryId: string,
    restaurantId: string,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { restaurantId: true },
    });

    if (!category || category.restaurantId !== restaurantId) {
      throw new NotFoundException('Category not found in this restaurant');
    }
  }

  private async assertMenuItemInRestaurant(
    itemId: string,
    restaurantId: string,
  ) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
      select: { restaurantId: true },
    });

    if (!item || item.restaurantId !== restaurantId) {
      throw new NotFoundException('Menu item not found in this restaurant');
    }
  }
}
