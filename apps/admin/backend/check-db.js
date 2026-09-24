const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.project.findUnique({ where: { id: 52 } });
  console.log('Project 52:', p);
}
main().finally(() => prisma.$disconnect());
