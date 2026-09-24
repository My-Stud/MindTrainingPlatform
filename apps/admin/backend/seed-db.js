const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const allSlugs = [
  // from games-static
  "bubble-pop-safari", "cactiquiz", "city-runner", "country-symbol-matcher", "find-room", "global-genius", "institute-orbit", "loop-game", "math-puzzle", "mystery-pointer", "parliament-master", "platformer", "river-country-game", "seven-wonders", "state-capital-shooter", "tactical-sniper", "tanker", "train-game", "trivia-smash", "vocabullseye", "wonder-assembly-hall", "wonder-bath-room", "wonder-bed-room", "wonder-canteen", "wonder-classroom", "wonder-computer-lab", "wonder-garden", "wonder-kitchen", "wonder-lab-chem", "wonder-lawn", "wonder-library", "wonder-play-ground", "wonder-principal-room", "wonder-school-bus", "wonder-school-toilet", "wonder-sick-room", "wonder-staff-room", "wonder1-assembly-hall", "wonder1-play-ground", "wonder1-principal-room", "wonder1-school-bus", "word-canve", "word-puzzle",
  // from src/app/games
  "color-clash", "country-shooter", "daily-teaser", "egg-catcher", "memory-matrix", "monkey-fruit-drop", "speed-match", "sudoku", "word-2-picture", "word-formation"
];

function titleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function main() {
  const existing = await prisma.project.findMany();
  const existingSlugs = new Set(existing.map(p => p.slug));

  const missing = allSlugs.filter(slug => !existingSlugs.has(slug));
  console.log(`Found ${missing.length} missing projects to insert.`);

  for (const slug of missing) {
    let name = titleCase(slug);
    // Adjust some names based on screenshot
    if (slug === 'word-canve') name = 'Word Cave';
    if (slug === 'word-2-picture') name = 'Word 2 Picture';
    if (slug === 'wonder-sick-room') name = 'Wonder Infirmary';
    if (slug === 'wonder-bath-room') name = 'Wonder Bathroom';
    if (slug === 'wonder-school-toilet') name = 'Wonder School Restroom';
    if (slug === 'daily-teaser') name = 'Daily Brain Teaser';
    if (slug === 'egg-catcher') name = 'Egg Toss';

    await prisma.project.create({
      data: {
        name: name,
        slug: slug,
        projectType: 'QUIZ',
        activeFolderId: null,
        allowedOrigins: JSON.stringify(["*"])
      }
    });
  }
  
  console.log("Database seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
