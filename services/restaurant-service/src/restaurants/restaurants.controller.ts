import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard, JwtPayload } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // ---------- Public ----------

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findOne(id);
  }

  // ---------- Owner only ----------

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(user.sub, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, user.sub, dto);
  }

  @Post(':id/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  addCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.restaurantsService.addCategory(id, user.sub, dto);
  }

  @Post(':id/menu-items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  addMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.restaurantsService.addMenuItem(id, user.sub, dto);
  }

  @Patch(':id/menu-items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  updateMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.restaurantsService.updateMenuItem(id, itemId, user.sub, dto);
  }

  @Delete(':id/menu-items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.restaurantsService.removeMenuItem(id, itemId, user.sub);
  }
}
