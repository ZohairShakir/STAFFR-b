import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Users, projects, and applications are created via Slack OAuth and the app UI.
  // No demo data is seeded — production data lives in your PostgreSQL database.
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.application.count(),
  ]);

  console.log(
    `Database ready (${counts[0]} users, ${counts[1]} projects, ${counts[2]} applications).`,
  );
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
