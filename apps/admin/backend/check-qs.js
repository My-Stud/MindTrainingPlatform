const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const qs = await prisma.question.findMany({ where: { projectId: 52 }, take: 1 });
  console.log(qs);
}
main().finally(() => prisma.$disconnect());
