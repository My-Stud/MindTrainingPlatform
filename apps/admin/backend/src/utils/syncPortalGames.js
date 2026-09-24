const prisma = require('../db');
const { PORTAL_GAMES } = require('./portalGames');

/**
 * Synchronizes all GAG portal games into the MySQL database.
 * If a game project doesn't exist, it creates it and populates sample questions.
 */
async function syncPortalGames() {
  console.log('🔄 Checking and synchronizing portal games with MySQL...');
  let createdCount = 0;
  let questionsAdded = 0;

  try {
    for (const game of PORTAL_GAMES) {
      try {
        // Check if project exists by slug
        let project = await prisma.project.findUnique({
          where: { slug: game.slug },
        });

        if (!project) {
          project = await prisma.project.create({
            data: {
              name: game.name,
              slug: game.slug,
              projectType: game.projectType || 'mcq',
              fieldLabelField1: game.fieldLabelField1 || 'Question',
              fieldLabelField2: game.fieldLabelField2 || 'Option A',
              fieldLabelField3: game.fieldLabelField3 || 'Hint',
              mainQuestionField: 'field1',
              questionsPerQuiz: game.questionsPerQuiz || 15,
              allowedOrigins: JSON.stringify(['http://localhost:3000', 'http://localhost:5173', '*']),
            },
          });
          createdCount++;
          console.log(`✔ Created MySQL project for game: "${game.name}" (${game.slug})`);

          // Populate sample questions if provided
          if (game.sampleQuestions && game.sampleQuestions.length > 0) {
            for (const q of game.sampleQuestions) {
              try {
                await prisma.question.create({
                  data: {
                    project: { connect: { id: project.id } },
                    field1: q.field1 || '',
                    field2: q.field2 || '',
                    field3: q.field3 || '',
                    optionA: q.optionA || '',
                    optionB: q.optionB || '',
                    optionC: q.optionC || '',
                    optionD: q.optionD || '',
                    correctAnswer: q.correctAnswer || '',
                    hint: q.hint || '',
                    difficulty: q.difficulty || 'medium',
                    category: q.category || '',
                  },
                });
                questionsAdded++;
              } catch (qErr) {
                console.warn(`Could not add sample question for ${game.slug}:`, qErr.message);
              }
            }
          }
        }
      } catch (innerErr) {
        // Skip individual conflict gracefully
        console.warn(`Skipping existing or conflicting game: ${game.slug}`);
      }
    }

    console.log(`✔ Portal games sync complete. ${createdCount} new projects created, ${questionsAdded} questions seeded.`);
    return { success: true, createdCount, questionsAdded, totalSynced: PORTAL_GAMES.length };
  } catch (error) {
    console.error('✘ Error synchronizing portal games:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { syncPortalGames };
