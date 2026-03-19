# Chess Academy — Chess Learning Platform

## Overview

A full-stack chess learning website with beautiful animations, interactive lessons, openings library, and user authentication. Data is persisted in local JSON files (no external database).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion
- **Chess logic**: chess.js
- **State management**: Zustand
- **Data fetching**: TanStack React Query
- **Database**: Local JSON files (DATABASEUSER.JSON, DATABASE.JSON)
- **Auth**: Custom token-based (no external auth)
- **Validation**: Zod, drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts/
  chess-academy/     # React + Vite frontend
  api-server/        # Express 5 backend API
    data/
      DATABASEUSER.JSON   # User accounts storage
      DATABASE.JSON       # Openings + progress storage
lib/
  api-spec/         # OpenAPI spec + Orval codegen config
  api-client-react/ # Generated React Query hooks
  api-zod/          # Generated Zod schemas
```

## Features

- **Home**: Animated chess hero section with interactive board
- **Login / Register**: Full auth system, users stored in DATABASEUSER.JSON
- **Openings Library**: 10 famous chess openings with ECO codes, move sequences, key ideas
- **Lessons**: 6 structured lessons covering Fundamentals, Tactics, Strategy, Endgame
- **Dashboard**: User progress, streak tracker, completed lessons/openings
- **Interactive Chess Board**: Animated pieces, move highlighting

## API Routes

- `POST /api/auth/register` — create account (saved to DATABASEUSER.JSON)
- `POST /api/auth/login` — login
- `GET /api/auth/me` — get current user (requires Authorization header)
- `GET /api/openings` — list all chess openings (from DATABASE.JSON)
- `GET /api/openings/:id` — single opening detail
- `GET /api/lessons` — list all lessons
- `GET /api/lessons/:id` — single lesson detail
- `GET /api/progress` — user progress (requires auth)
- `POST /api/progress` — update progress (requires auth)

## Frontend Routes

- `/` — Landing page
- `/login` — Login page
- `/register` — Register page
- `/dashboard` — User dashboard (auth required)
- `/openings` — Openings library
- `/openings/:id` — Opening detail with interactive board
- `/lessons` — Lessons list
- `/lessons/:id` — Lesson detail with exercises
