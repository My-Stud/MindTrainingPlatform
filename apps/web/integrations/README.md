# VieBrain API Integration

Connect your Express admin panel to the VieBrain Next.js app via API.

## Setup

### 1. Next.js App (this project)

Already configured. Make sure these env vars are set in `.env`:

```
API_KEY="viebrain-admin-panel-secret-key-change-in-production"
ALLOWED_ORIGINS="http://localhost:3001,http://localhost:4000"
```

Start the Next.js app:

```bash
cd mind-training-app
npm run dev
```

### 2. Express Admin Panel

Add to your Express project's `.env`:

```
VIEBRAIN_API_URL=http://localhost:3000
VIEBRAIN_API_KEY=viebrain-admin-panel-secret-key-change-in-production
```

Copy `integrations/viebrain-api-client.js` into your Express project.

Install in your Express project:

```bash
npm install viebrain-api  # or just require the file directly
```

## Usage Examples

```js
const viebrain = require("./viebrain-api-client");

// ── List users ──
const { users, pagination } = await viebrain.getUsers({
  search: "john",
  role: "USER",
  class: "Class 10",
  page: 1,
  limit: 20,
});

// ── List question sets ──
const { questionSets } = await viebrain.getQuestionSets({
  search: "math",
  page: 1,
});

// ── List games ──
const { games } = await viebrain.getGames({ category: "Memory" });

// ── Upload a question set ──
const fileBuffer = fs.readFileSync("./questions.csv");
await viebrain.uploadQuestionSet({
  name: "Chapter 1 Quiz",
  fileBuffer,
  fileName: "questions.csv",
  gameIds: ["game-id-1", "game-id-2"],
});

// ── Assign exam to a user ──
await viebrain.assignExam({
  questionSetId: "set-id-123",
  targetType: "user",       // or "class"
  targetId: "student@email.com",
  scheduledFor: "2026-09-01T10:00:00Z",
});

// ── Get scores ──
const { scores } = await viebrain.getScores({
  userId: "user-id-456",
  gameId: "game-id-789",
  page: 1,
});

// ── Toggle user role ──
await viebrain.toggleUserRole("user-id-123");

// ── Delete question set ──
await viebrain.deleteQuestionSet("set-id-456");
```

## API Endpoints Reference

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/admin/users` | List users (paginated, filterable) | API Key |
| GET | `/api/admin/question-sets` | List question sets | API Key |
| GET | `/api/admin/games` | List all games | API Key |
| GET | `/api/admin/scores` | List scores (filterable) | API Key |
| POST | `/api/admin/upload-csv` | Upload question set (CSV/DOCX/TXT) | API Key |
| POST | `/api/admin/delete-set?id=X` | Delete question set | API Key |
| POST | `/api/admin/edit-set-games` | Link games to question set | API Key |
| POST | `/api/admin/assign-exam` | Assign exam to user/class | API Key |
| POST | `/api/admin/delete-assignment?id=X` | Delete exam assignment | API Key |
| POST | `/api/admin/toggle-role?id=X` | Toggle user ADMIN/USER | API Key |
| POST | `/api/admin/register` | Create admin user | API Key |

All GET endpoints support `page` and `limit` query params for pagination.

## Authentication

Requests are authenticated via the `X-API-Key` header. The key must match the `API_KEY` env var in the Next.js app. This allows service-to-service communication without needing a user session.
