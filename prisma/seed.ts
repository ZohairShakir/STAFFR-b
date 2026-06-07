import { PrismaClient, UserRole, ProjectStatus, ApplicationStatus, ApplicationSource } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding skipped — no hardcoded users. First signup becomes SUPER_ADMIN.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
