const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const projects = await prisma.project.findMany();
  console.log(projects.map(p => p.name));
}
main().finally(() => prisma.$disconnect());
