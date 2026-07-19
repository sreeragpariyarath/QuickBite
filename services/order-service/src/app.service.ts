import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        service: 'order-service',
        database: 'down',
      });
    }

    return {
      status: 'ok',
      service: 'order-service',
      database: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}
