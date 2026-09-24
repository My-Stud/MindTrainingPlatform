const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const ps = await prisma.project.findMany();
  console.log(ps.map(p => ({ id: p.id, name: p.name, type: p.projectType })));
}
main().finally(() => prisma.$disconnect());
