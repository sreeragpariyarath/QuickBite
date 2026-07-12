import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Service + database connectivity check.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        service: 'restaurant-service',
        database: 'up',
        timestamp: '2026-07-12T10:00:00.000Z',
      },
    },
  })
  @ApiServiceUnavailableResponse({ description: 'Database unreachable' })
  getHealth() {
    return this.appService.getHealth();
  }
}
