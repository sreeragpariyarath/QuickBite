import { Injectable, ServiceUnavailableException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

import { UserRole } from '@prisma-app/client';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const adminEmail = 'admin@quickbite.com';
    const adminId = '00000000-0000-0000-0000-000000000000';

    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await this.prisma.user.create({
          data: {
            id: adminId,
            email: adminEmail,
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
            isEmailVerified: true,
            name: 'Super Admin',
          },
        });
        console.log('✅ Super Admin successfully seeded!');
      } else if (existing.role !== UserRole.SUPER_ADMIN) {
        await this.prisma.user.update({
          where: { email: adminEmail },
          data: { role: UserRole.SUPER_ADMIN },
        });
        console.log('✅ Updated existing admin user role to SUPER_ADMIN!');
      }
    } catch (err) {
      console.error('❌ Failed to seed Super Admin:', err);
    }
  }

  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        service: 'auth-service',
        database: 'down',
      });
    }

    return {
      status: 'ok',
      service: 'auth-service',
      database: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}
