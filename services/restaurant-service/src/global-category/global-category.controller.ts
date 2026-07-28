import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GlobalCategoryService } from './global-category.service';
import { CreateGlobalCategoryDto } from './dto/create-global-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('global-categories')
@Controller('global-categories')
export class GlobalCategoryController {
  constructor(private readonly globalCategoryService: GlobalCategoryService) {}

  @Get()
  @ApiOperation({
    summary: 'List all global categories',
    description: 'Get all active global categories. Public — no auth required.',
  })
  @ApiOkResponse({ description: 'Array of global categories' })
  findAll() {
    return this.globalCategoryService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a global category',
    description: 'Create a new global category. Scoped to Owner/Admin roles.',
  })
  @ApiCreatedResponse({ description: 'The created global category record' })
  create(@Body() dto: CreateGlobalCategoryDto) {
    return this.globalCategoryService.create(dto);
  }
}
