const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const qs = await prisma.question.findMany({ where: { projectId: 52 } });
  console.log(JSON.stringify(qs, null, 2));
}
main().finally(() => prisma.$disconnect());
