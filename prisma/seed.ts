import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const query1 = await prisma.prompt.upsert({
    where: { id: 1 },
    update: {},
    create: {
      content: 'Hello World',
      status: 'SUCCESS',
    },
  });

  const query2 = await prisma.prompt.upsert({
    where: { id: 2 },
    update: {},
    create: {
      content: 'Hello Jaime',
      status: 'FAILURE',
    },
  });

  const query3 = await prisma.prompt.upsert({
    where: { id: 3 },
    update: {},
    create: {
      content: 'What will be the weather today?',
      status: 'PENDING',
    },
  });

  const query4 = await prisma.prompt.upsert({
    where: { id: 4 },
    update: {},
    create: {
      content: 'What will be the weather tomorrow?',
      status: 'IN_PROGRESS',
    },
  });

  console.log(query1, query2, query3, query4);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
