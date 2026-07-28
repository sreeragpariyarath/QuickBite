import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GlobalCategoryService } from './global-category.service';
import { GlobalCategoryController } from './global-category.controller';

@Module({
  imports: [PrismaModule],
  controllers: [GlobalCategoryController],
  providers: [GlobalCategoryService],
  exports: [GlobalCategoryService],
})
export class GlobalCategoryModule {}
