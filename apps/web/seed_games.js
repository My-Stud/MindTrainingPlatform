const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const games = [
    { name: "Country Shooter", category: "Focus", description: "Shoot the correct countries" },
    { name: "Memory Matrix", category: "Memory", description: "Remember the pattern" },
    { name: "Focus Flow", category: "Focus", description: "Keep your attention steady" },
    { name: "Logic Lock", category: "Logic", description: "Solve the puzzle to unlock" }
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { name: game.name },
      update: {},
      create: game,
    });
  }
  console.log("Successfully added games!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
