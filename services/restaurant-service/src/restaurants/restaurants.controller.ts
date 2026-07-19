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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // ---------- Public ----------

  @Get()
  @ApiOperation({
    summary: 'List restaurants',
    description:
      'All active restaurants, optionally filtered by city (case-insensitive). Public — no auth required.',
  })
  @ApiQuery({
    name: 'city',
    required: false,
    example: 'Kochi',
    description: 'Filter by city',
  })
  @ApiOkResponse({ description: 'Array of active restaurants' })
  findAll(@Query('city') city?: string) {
    return this.restaurantsService.findAll(city);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Restaurant details (with menu)',
    description:
      'Restaurant with its categories and available menu items. Public — no auth required.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Restaurant with nested menu' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findOne(id);
  }

  // ---------- Owner only ----------

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create restaurant',
    description:
      'OWNER role required. Names are not globally unique (branches and same-name restaurants are allowed), but the same owner cannot create the same name at the same address twice.',
  })
  @ApiCreatedResponse({ description: 'Restaurant created' })
  @ApiConflictResponse({
    description: 'You already have a restaurant with this name at this address',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiForbiddenResponse({ description: 'CUSTOMER role cannot create restaurants' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(user.sub, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update restaurant',
    description: 'Only the owner of this restaurant.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Restaurant updated' })
  @ApiForbiddenResponse({ description: 'You do not own this restaurant' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add category',
    description: 'Only the owner of this restaurant.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Category created' })
  @ApiForbiddenResponse({ description: 'You do not own this restaurant' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add menu item',
    description:
      'Only the owner of this restaurant. categoryId is optional.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Menu item created' })
  @ApiForbiddenResponse({ description: 'You do not own this restaurant' })
  @ApiNotFoundResponse({
    description: 'Restaurant or category not found in this restaurant',
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update menu item',
    description: 'Only the owner of this restaurant.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'itemId', format: 'uuid' })
  @ApiOkResponse({ description: 'Menu item updated' })
  @ApiForbiddenResponse({ description: 'You do not own this restaurant' })
  @ApiNotFoundResponse({ description: 'Menu item not found in this restaurant' })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete menu item',
    description: 'Only the owner of this restaurant. Returns 204.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'itemId', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Menu item deleted' })
  @ApiForbiddenResponse({ description: 'You do not own this restaurant' })
  @ApiNotFoundResponse({ description: 'Menu item not found in this restaurant' })
  removeMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.restaurantsService.removeMenuItem(id, itemId, user.sub);
  }
}
