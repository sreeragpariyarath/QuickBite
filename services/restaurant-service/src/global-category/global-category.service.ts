import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGlobalCategoryDto } from './dto/create-global-category.dto';

@Injectable()
export class GlobalCategoryService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seed();
  }

  async findAll() {
    return this.prisma.globalCategory.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(dto: CreateGlobalCategoryDto) {
    return this.prisma.globalCategory.create({
      data: {
        name: dto.name,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async seed() {
    try {
      const count = await this.prisma.globalCategory.count();
      if (count > 0) return;

      // Seed list of default items matching the user's layout bubbles
      const defaults = [
        { name: 'Burgers', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200001/categories/burgers.png' },
        { name: 'Pizza', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200002/categories/pizza.png' },
        { name: 'Indian', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200003/categories/indian.png' },
        { name: 'Desserts', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200004/categories/desserts.png' },
        { name: 'Beverages', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200005/categories/beverages.png' },
        { name: 'Chinese', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200006/categories/chinese.png' },
        { name: 'Italian', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200007/categories/italian.png' },
        { name: 'Healthy', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200008/categories/healthy.png' },
        { name: 'Street Food', imageUrl: 'https://res.cloudinary.com/sreeragp/image/upload/v1722200009/categories/street_food.png' },
      ];

      for (const item of defaults) {
        await this.prisma.globalCategory.create({
          data: item,
        });
      }
      console.log('✅ Global categories successfully seeded!');
    } catch (err) {
      console.error('Failed to seed global categories:', err);
    }
  }
}
