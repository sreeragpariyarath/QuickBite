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
import { UpdateRestaurantStatusDto } from './dto/update-restaurant-status.dto';
import { AddStaffDto } from './dto/add-staff.dto';
import { JwtAuthGuard, JwtPayload } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // ---------- Public / Filtered ----------

  @Get()
  @ApiOperation({
    summary: 'List restaurants',
    description:
      'All active restaurants, optionally filtered by city, cuisine, ownerId, or status.',
  })
  @ApiQuery({ name: 'city', required: false, example: 'Kochi' })
  @ApiQuery({ name: 'cuisine', required: false, example: 'Burgers' })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiQuery({ name: 'all', required: false, example: 'true' })
  @ApiOkResponse({ description: 'Array of restaurants' })
  findAll(
    @Query('city') city?: string,
    @Query('cuisine') cuisine?: string,
    @Query('ownerId') ownerId?: string,
    @Query('status') status?: string,
    @Query('all') all?: string,
  ) {
    return this.restaurantsService.findAll(city, cuisine, ownerId, status, all === 'true');
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Restaurant details (with menu & staff)',
    description: 'Restaurant with its categories, menu items, and staff.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Restaurant details' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findOne(id);
  }

  // ---------- Super Admin Endpoints ----------

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Approve / Suspend restaurant status',
    description: 'SUPER_ADMIN role required. Updates restaurant status to ACTIVE, SUSPENDED, or REJECTED.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Restaurant status updated' })
  @ApiForbiddenResponse({ description: 'SUPER_ADMIN role required' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRestaurantStatusDto,
  ) {
    return this.restaurantsService.updateStatus(id, dto);
  }

  // ---------- Owner Endpoints ----------

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Submit restaurant for onboarding approval',
    description: 'OWNER role required. Creates a new restaurant application with PENDING_APPROVAL status.',
  })
  @ApiCreatedResponse({ description: 'Restaurant application submitted' })
  @ApiConflictResponse({ description: 'Duplicate name/address for this owner' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(user.sub, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update restaurant details' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Restaurant updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OWNER')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete restaurant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Restaurant deleted' })
  removeRestaurant(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.removeRestaurant(id);
  }

  // ---------- Staff / Manager Management ----------

  @Post(':id/staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite or assign staff member (Manager/Cashier/Kitchen)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Staff member assigned' })
  addStaff(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: AddStaffDto,
  ) {
    return this.restaurantsService.addStaff(id, user.sub, dto);
  }

  @Get(':id/staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List staff members for restaurant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'List of staff members' })
  getStaff(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.restaurantsService.getStaff(id, user.sub);
  }

  @Delete(':id/staff/:staffId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove staff member from restaurant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'staffId', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Staff member removed' })
  removeStaff(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.restaurantsService.removeStaff(id, staffId, user.sub);
  }

  // ---------- Categories & Menu Items ----------

  @Post(':id/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add category' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Category created' })
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
  @ApiOperation({ summary: 'Add menu item' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Menu item created' })
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
  @ApiOperation({ summary: 'Update menu item' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'itemId', format: 'uuid' })
  @ApiOkResponse({ description: 'Menu item updated' })
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
  @ApiOperation({ summary: 'Delete menu item' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'itemId', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Menu item deleted' })
  removeMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.restaurantsService.removeMenuItem(id, itemId, user.sub);
  }
}
