import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.item.createMany({
    data: [
      { name: 'Apple', price: 0.99 },
      { name: 'Banana', price: 0.59 },
      { name: 'Milk', price: 2.49 },
      { name: 'Bread', price: 1.99 },
    ],
    skipDuplicates: true,
  });
  console.log('Seeded items!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
