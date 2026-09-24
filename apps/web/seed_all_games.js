const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const games = [
    { id: "memory-matrix", name: "Memory Matrix", category: "Memory", description: "Improve your spatial recall." },
    { id: "speed-match", name: "Speed Match", category: "Speed", description: "Enhance your processing speed." },
    { id: "color-clash", name: "Color Clash", category: "Attention", description: "Train cognitive flexibility." },
    { id: "daily-teaser", name: "Daily Brain Teaser", category: "Logic", description: "A new logic puzzle." },
    { id: "egg-catcher", name: "Egg Toss", category: "Reflex", description: "A fun and addictive timing game." },
    { id: "monkey-fruit-drop", name: "Monkey Fruit Drop", category: "Reflex", description: "Catch the falling blackberries." },
    { id: "sudoku", name: "Sudoku", category: "Logic", description: "The classic 9x9 number puzzle." },
    { id: "word-formation", name: "Word Formation", category: "Language", description: "Connect letters to form words." },
    { id: "word-2-picture", name: "Word 2 Picture", category: "Language", description: "Match words to their correct pictures." },
    { id: "country-shooter", name: "Country Shooter", category: "Knowledge", description: "Test your geography knowledge." },
    { id: "global-genius", name: "Global Genius", category: "Knowledge", description: "Explore the world." },
    { id: "word-canve", name: "Word Canvas", category: "Language", description: "Paint with words." },
    { id: "word-puzzle", name: "Word Puzzle", category: "Language", description: "Solve challenging word puzzles." },
    { id: "math-puzzle", name: "Math Puzzle", category: "Logic", description: "Sharpen your mental math." },
    { id: "train-game", name: "Train Game", category: "Logic", description: "Train your brain with numerical paths." },
    { id: "find-room", name: "Find Room", category: "Attention", description: "Find hidden objects." },
    { id: "loop-game", name: "Loop Game", category: "Logic", description: "Connect paths and close endless loops." },
    { id: "bubble-pop-safari", name: "Bubble Pop Safari", category: "Reflex", description: "Pop numbered bubbles." },
    { id: "state-capital-shooter", name: "State Capital Shooter", category: "Knowledge", description: "Aim your cannon." },
    { id: "country-symbol-matcher", name: "Country Symbol Matcher", category: "Knowledge", description: "Connect country flags." },
    { id: "river-country-game", name: "River Country Challenge", category: "Knowledge", description: "Master city, country, river." },
    { id: "parliament-master", name: "Parliament Master", category: "Knowledge", description: "Test your legislative knowledge." },
    { id: "trivia-smash", name: "Trivia Smash", category: "Knowledge", description: "Smash through 3D blocks." },
    { id: "institute-orbit", name: "Institute Orbit", category: "Knowledge", description: "Launch into orbit." },
    { id: "seven-wonders", name: "Seven Wonders", category: "Knowledge", description: "Explore ancient wonders." },
    { id: "mystery-pointer", name: "Mystery Pointer(Vocab)", category: "Logic", description: "Move your flashlight." },
    { id: "wonder-sick-room", name: "Wonder Sick Room", category: "Logic", description: "Find hidden wonders." },
    { id: "wonder-assembly-hall", name: "Wonder Assembly Hall", category: "Logic", description: "Explore the assembly hall." },
    { id: "wonder-bath-room", name: "Wonder Bath Room", category: "Logic", description: "Find your way through." },
    { id: "wonder-bed-room", name: "Wonder Bed Room", category: "Logic", description: "Solve puzzles." },
    { id: "wonder-school-toilet", name: "Wonder School Toilet", category: "Logic", description: "Find your way through." },
    { id: "wonder-school-bus", name: "Wonder School Bus", category: "Logic", description: "Hop on the wonderful school bus." },
    { id: "wonder-principal-room", name: "Wonder Principal Room", category: "Logic", description: "Solve puzzles." },
    { id: "wonder-library", name: "Wonder Library", category: "Logic", description: "Discover the hidden secrets." },
    { id: "wonder-play-ground", name: "Wonder Play Ground", category: "Logic", description: "Have fun and solve puzzles." }
];

async function main() {
  for (const game of games) {
    await prisma.game.upsert({
      where: { name: game.name },
      update: { description: game.description, category: game.category },
      create: { name: game.name, description: game.description, category: game.category },
    });
  }
  console.log("Successfully seeded all 35 games from Mind Gym!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
