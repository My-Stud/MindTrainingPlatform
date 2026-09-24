const { PrismaClient } = require('./apps/admin/backend/node_modules/.prisma/client'); const prisma = new PrismaClient(); prisma.admin.findMany().then(console.log).finally(()=>prisma.$disconnect());
