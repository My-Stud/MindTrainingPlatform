const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const f = await prisma.folder.findFirst();
  console.log('Type of folder id:', typeof f.id, f.id);
}
main().finally(() => prisma.$disconnect());
