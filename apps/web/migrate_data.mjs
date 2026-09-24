import { PrismaClient as SQLiteClient } from './prisma-sqlite/generated/sqlite-client/index.js';
import { PrismaClient as PostgresClient } from './src/generated/prisma/index.js';

const sqlite = new SQLiteClient();
const postgres = new PostgresClient();

async function migrate() {
  console.log("Starting database migration from SQLite to PostgreSQL...");

  try {
    // 1. Users
    const users = await sqlite.$queryRawUnsafe('SELECT * FROM User');
    if (users.length > 0) {
      await postgres.user.createMany({ data: users });
      console.log(`✅ Migrated ${users.length} Users`);
    }

    // 2. Games
    const games = await sqlite.$queryRawUnsafe('SELECT * FROM Game');
    if (games.length > 0) {
      await postgres.game.createMany({ data: games });
      console.log(`✅ Migrated ${games.length} Games`);
    }

    // 3. Scores
    const scores = await sqlite.$queryRawUnsafe('SELECT * FROM Score');
    if (scores.length > 0) {
      await postgres.score.createMany({ data: scores });
      console.log(`✅ Migrated ${scores.length} Scores`);
    }

    // 4. Streaks
    const streaks = await sqlite.$queryRawUnsafe('SELECT * FROM Streak');
    if (streaks.length > 0) {
      await postgres.streak.createMany({ data: streaks });
      console.log(`✅ Migrated ${streaks.length} Streaks`);
    }

    // 5. Accounts
    const accounts = await sqlite.$queryRawUnsafe('SELECT * FROM Account');
    if (accounts.length > 0) {
      await postgres.account.createMany({ data: accounts });
      console.log(`✅ Migrated ${accounts.length} Accounts`);
    }

    // 6. Sessions
    const sessions = await sqlite.$queryRawUnsafe('SELECT * FROM Session');
    if (sessions.length > 0) {
      await postgres.session.createMany({ data: sessions });
      console.log(`✅ Migrated ${sessions.length} Sessions`);
    }

    // 7. VerificationTokens
    const tokens = await sqlite.$queryRawUnsafe('SELECT * FROM VerificationToken');
    if (tokens.length > 0) {
      await postgres.verificationToken.createMany({ data: tokens });
      console.log(`✅ Migrated ${tokens.length} VerificationTokens`);
    }

    console.log("🎉 Migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await sqlite.$disconnect();
    await postgres.$disconnect();
  }
}

migrate();
