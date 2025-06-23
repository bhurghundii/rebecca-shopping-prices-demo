import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function getItems() {
  return prisma.item.findMany();
}

export async function upsertItem(name: string, price: number) {
  return prisma.item.upsert({
    where: { name },
    update: { price },
    create: { name, price },
  });
}
