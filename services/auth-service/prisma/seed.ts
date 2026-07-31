import { PrismaClient, UserRole } from '@prisma-app/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://quickbite:quickbite123@localhost:5432/auth_db?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@quickbite.com';
  const adminId = '00000000-0000-0000-0000-000000000000';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      id: adminId,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      name: 'Super Admin',
    },
  });

  console.log(`✅ Super Admin seeded successfully: ${user.email} (${user.role})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
