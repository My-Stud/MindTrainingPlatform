const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const q = await prisma.question.findFirst({ where: { field1: { contains: 'students eager to learn' } } });
  console.log(q);
}
main().finally(() => prisma.$disconnect());
