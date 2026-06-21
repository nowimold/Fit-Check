# Project Scaffolding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the initial monorepo structure for the Fit Check app so frontend, backend, and database work can start immediately.

**Architecture:** Use a small npm workspace monorepo with a root package for shared scripts, a Node.js/Express backend, a minimal frontend scaffold, and a database folder for PostgreSQL schema and migration files. Keep each area isolated so it can grow independently without forcing a rework later.

**Tech Stack:** npm workspaces, Node.js, Express, PostgreSQL SQL files, simple static frontend scaffold.

---

### Task 1: Create the repository skeleton

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `frontend/`
- Create: `backend/`
- Create: `db/`

- [ ] **Step 1: Add the root workspace manifest**

```json
{
  "name": "fit-check",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "npm run dev -w backend",
    "dev:backend": "npm run dev -w backend",
    "dev:frontend": "npm run dev -w frontend",
    "start": "npm run start -w backend"
  }
}
```

- [ ] **Step 2: Add ignore rules and environment example**

```gitignore
node_modules
.env
.DS_Store
dist
coverage
```

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fit_check
```

- [ ] **Step 3: Create empty app folders**

```text
frontend/
backend/
db/
```

- [ ] **Step 4: Verify the root layout**

Run: `git status --short`
Expected: new root files and directories appear, with no accidental deletions.

### Task 2: Scaffold the backend

**Files:**
- Create: `backend/package.json`
- Create: `backend/src/app.js`
- Create: `backend/src/server.js`
- Create: `backend/src/routes/health.js`

- [ ] **Step 1: Add the backend package manifest**

```json
{
  "name": "fit-check-backend",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

- [ ] **Step 2: Add the Express app and health route**

```js
import express from 'express';
import healthRouter from './routes/health.js';

const app = express();

app.use(express.json());
app.use('/health', healthRouter);

export default app;
```

```js
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
```

- [ ] **Step 3: Add the server entrypoint**

```js
import app from './app.js';

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
```

- [ ] **Step 4: Verify the backend starts**

Run: `npm install && npm run dev -w backend`
Expected: console shows `Backend listening on port 3000`.

### Task 3: Scaffold the frontend

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.js`
- Create: `frontend/src/dev-server.js`

- [ ] **Step 1: Add the frontend package manifest**

```json
{
  "name": "fit-check-frontend",
  "private": true,
  "scripts": {
    "dev": "node ./src/dev-server.js"
  }
}
```

- [ ] **Step 2: Add a minimal landing page**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fit Check</title>
  </head>
  <body>
    <main>
      <h1>Fit Check</h1>
      <p>모바일 우선 웹 앱 스캐폴딩이 준비되었습니다.</p>
    </main>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

```js
console.log('Fit Check frontend ready');
```

- [ ] **Step 3: Verify the frontend files exist**

Run: `git status --short`
Expected: frontend files appear as new additions.

### Task 4: Add the database scaffold

**Files:**
- Create: `db/schema.sql`
- Create: `db/README.md`

- [ ] **Step 1: Add the initial schema placeholder**

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] **Step 2: Add a short database note**

```md
# Database

Put PostgreSQL schema and migration files in this folder.
```

- [ ] **Step 3: Verify the database scaffold**

Run: `git status --short`
Expected: `db/schema.sql` and `db/README.md` appear.

### Task 5: Commit and push the scaffold

**Files:**
- Modify: tracked scaffold files only

- [ ] **Step 1: Review the final diff**

Run: `git --no-pager diff --stat`
Expected: only scaffold files are listed.

- [ ] **Step 2: Commit the scaffold**

Run: `git add . && git commit -m "chore: scaffold initial project structure"`
Expected: a clean commit on `master`.

- [ ] **Step 3: Push the commit**

Run: `git push origin master`
Expected: the new scaffold commit is visible on GitHub.
