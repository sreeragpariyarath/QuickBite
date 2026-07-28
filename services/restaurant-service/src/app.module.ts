import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { GlobalCategoryModule } from './global-category/global-category.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    PrismaModule,
    RestaurantsModule,
    GlobalCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
