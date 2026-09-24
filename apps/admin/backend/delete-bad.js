const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.question.deleteMany({ where: { projectId: 52 } });
  console.log('Deleted bad questions');
}
main().finally(() => prisma.$disconnect());
