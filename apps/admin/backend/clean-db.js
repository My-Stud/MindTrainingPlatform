const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const keepSlugs = [
  'country-shooter',
  'tactical-sniper',
  'tanker',
  'city-runner',
  'platformer',
  'vocabullseye',
  'state-capital-shooter',
  'cactiquiz',
  'trivia-smash',
  'institute-orbit',
  'mystery-pointer'
];

async function main() {
  const result = await prisma.project.deleteMany({
    where: {
      slug: {
        notIn: keepSlugs
      }
    }
  });
  console.log(`Deleted ${result.count} unwanted projects from the database.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
