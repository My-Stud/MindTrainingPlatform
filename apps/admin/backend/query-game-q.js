const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const q = await prisma.question.findFirst({ where: { field1: { contains: 'What quality makes students eager to learn' } } });
  console.log(q);
}
main().finally(() => prisma.$disconnect());
