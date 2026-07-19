import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard, JwtPayload } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('CUSTOMER')
  @ApiOperation({
    summary: 'Place order',
    description:
      'CUSTOMER only. Menu item names and prices are snapshotted at order time; total is computed server-side. Payment: COD. Status starts at PENDING.',
  })
  @ApiCreatedResponse({ description: 'Order created with nested items' })
  @ApiBadRequestResponse({
    description: 'Restaurant inactive, or a menu item is unavailable',
  })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiForbiddenResponse({ description: 'OWNER role cannot place orders' })
  @ApiServiceUnavailableResponse({
    description: 'Restaurant service unreachable',
  })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List my orders',
    description:
      'CUSTOMER: orders they placed. OWNER: incoming orders for their restaurants. Newest first.',
  })
  @ApiOkResponse({ description: 'Array of orders with items' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.ordersService.findAllFor(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Order details',
    description: 'Visible to the ordering customer and the restaurant owner.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Order with items' })
  @ApiForbiddenResponse({ description: 'Not your order' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.findOneFor(id, user);
  }

  @Patch(':id/accept')
  @Roles('OWNER')
  @ApiOperation({
    summary: 'Accept order',
    description: 'Owner of the restaurant only. PENDING → ACCEPTED.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Order accepted' })
  @ApiBadRequestResponse({ description: 'Order is not PENDING' })
  @ApiForbiddenResponse({ description: 'Not your restaurant’s order' })
  accept(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.accept(id, user);
  }

  @Patch(':id/reject')
  @Roles('OWNER')
  @ApiOperation({
    summary: 'Reject order',
    description: 'Owner of the restaurant only. PENDING → REJECTED.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Order rejected' })
  @ApiBadRequestResponse({ description: 'Order is not PENDING' })
  @ApiForbiddenResponse({ description: 'Not your restaurant’s order' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.reject(id, user);
  }

  @Patch(':id/prepare')
  @Roles('OWNER')
  @ApiOperation({
    summary: 'Start preparing',
    description: 'Owner of the restaurant only. ACCEPTED → PREPARING.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Order moved to PREPARING' })
  @ApiBadRequestResponse({ description: 'Order is not ACCEPTED' })
  @ApiForbiddenResponse({ description: 'Not your restaurant’s order' })
  prepare(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.prepare(id, user);
  }

  @Patch(':id/deliver')
  @Roles('OWNER')
  @ApiOperation({
    summary: 'Mark delivered',
    description:
      'Owner of the restaurant only. PREPARING → DELIVERED; COD payment is marked PAID.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Order delivered, payment marked PAID' })
  @ApiBadRequestResponse({ description: 'Order is not PREPARING' })
  @ApiForbiddenResponse({ description: 'Not your restaurant’s order' })
  deliver(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.deliver(id, user);
  }

  @Patch(':id/cancel')
  @Roles('CUSTOMER')
  @ApiOperation({
    summary: 'Cancel order',
    description:
      'The ordering customer only. Allowed while PENDING or ACCEPTED.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Order cancelled' })
  @ApiBadRequestResponse({ description: 'Order can no longer be cancelled' })
  @ApiForbiddenResponse({ description: 'Not your order' })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.cancel(id, user);
  }
}
