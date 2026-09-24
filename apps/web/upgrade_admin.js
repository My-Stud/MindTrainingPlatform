const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    data: { role: 'ADMIN' },
  });
  console.log('Updated users:', result.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
