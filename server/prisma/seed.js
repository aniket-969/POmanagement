import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {}, 
    create: {
      email: '',
      passwordHash,
      fullName: 'System Administrator',
      role: 'admin',
      status: 'active',
    },
  });

  console.log('✅ Admin user seeded:', admin);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
