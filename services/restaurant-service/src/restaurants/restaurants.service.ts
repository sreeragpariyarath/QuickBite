import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class RestaurantsService implements OnModuleInit {
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

  findAll(city?: string, cuisine?: string, ownerId?: string) {
    return this.prisma.restaurant.findMany({
      where: {
        ...(ownerId ? { ownerId } : { isActive: true }),
        ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
        ...(cuisine ? { cuisines: { has: cuisine } } : {}),
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

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    try {
      const count = await this.prisma.restaurant.count();
      if (count > 0) return;

      const ownerId = '00000000-0000-0000-0000-000000000000';
      const defaults = [
        {
          name: 'The Burger Co.',
          description: 'Delicious premium burgers and sides',
          address: '123 Main St, Koramangala',
          city: 'Koramangala',
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400',
          cuisines: ['Burgers', 'American'],
          ownerId,
        },
        {
          name: 'Pizza House',
          description: 'Wood-fired oven pizzas and pastas',
          address: '456 Ring Rd, Koramangala',
          city: 'Koramangala',
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400',
          cuisines: ['Pizza', 'Italian'],
          ownerId,
        },
        {
          name: 'Wok Express',
          description: 'Indo-Chinese street food stir-frys',
          address: '789 Double Rd, Koramangala',
          city: 'Koramangala',
          imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400',
          cuisines: ['Chinese', 'Asian'],
          ownerId,
        },
        {
          name: 'Sweet Truth',
          description: 'Decadent chocolates and layer cakes',
          address: '101 Baker St, Koramangala',
          city: 'Koramangala',
          imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400',
          cuisines: ['Desserts', 'Bakery'],
          ownerId,
        },
        {
          name: 'Andhra Ruchulu',
          description: 'Spicy traditional Andhra thalis',
          address: '202 Andhra Ln, Koramangala',
          city: 'Koramangala',
          imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=400',
          cuisines: ['Indian'],
          ownerId,
        },
        {
          name: 'Burger King',
          description: 'Flame-grilled burgers and hot fries',
          address: '303 Mall St, Koramangala',
          city: 'Koramangala',
          imageUrl: 'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?q=80&w=400',
          cuisines: ['Burgers', 'Fast Food'],
          ownerId,
        },
      ];

      for (const item of defaults) {
        await this.prisma.restaurant.create({
          data: item,
        });
      }
      console.log('✅ Restaurants successfully seeded!');
    } catch (err) {
      console.error('Failed to seed restaurants:', err);
    }
  }
}
