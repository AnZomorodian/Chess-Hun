# ♟ Chess Academy

A full-stack, self-hosted chess learning platform — beautifully designed, deeply educational, and completely self-hosted with no external database required.

![Node.js](https://img.shields.io/badge/Node.js-20%2B-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## Features

### Structured Learning
- **30 Masterclasses** — from absolute beginner fundamentals to grandmaster-level concepts
- 5 **Elite Lessons** locked behind **2000+ ELO** — real advanced content reserved for serious players
- Rich **Markdown lesson content** with tables, code blocks, and headers
- **Interactive multiple-choice exercises** after every lesson with detailed explanations
- **Lesson completion system** with XP rewards, celebration screen, and "Up Next" progression

### Openings Library (42 Openings)
- Full openings database with **ECO codes**, **key ideas**, **move sequences**, and **difficulty tiers**
- Beginner classics (Italian, French, Caro-Kann, London), Intermediate (Ruy López, Scotch, Vienna, KIA), and Advanced (Sveshnikov, Benko, Pirc, Grünfeld)
- Filter by difficulty or search by name/ECO code
- Interactive move display with chess notation

### Tactical Traps (19 Traps)
- Famous traps with full explanations: Fried Liver, Budapest Gambit, Noah's Ark, Scholar's Mate, and more
- Detailed move-by-move breakdown with counter-play explanation

### Progression System
- **ELO Rating** — grows with lesson completions
- **XP Points** — 50 / 80 / 120 XP by difficulty (Beginner / Intermediate / Advanced)
- **Daily Streaks** — keep your learning streak alive
- **5 Levels** — Beginner → Intermediate → Advanced → Expert → Master
- **20 Achievements** — lesson milestones, streaks, XP goals, ELO targets

### User Features
- Secure **registration and login** with HMAC-signed tokens
- **Profile page** with avatar, bio, country, preferred side, favorite opening
- **XP Breakdown** — see XP earned by difficulty and total study time
- **Chess Platform Links** — link accounts from Chess.com, Lichess, ChessKid, Chess24, Chess Tempo, ChessBase, ICC, Playchess, FIDE
- **Display name cooldown** — can be changed once every 3 days
- **Leaderboard privacy** — hide yourself from the public rankings
- **Public Profiles** — shareable player pages at `/users/:id`

### Community
- **Global Leaderboard** — ranked by ELO with platform account links visible
- **Public Profile Pages** — view any player's level, rating, openings studied, and linked accounts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| State | Zustand + TanStack React Query |
| Routing | Wouter |
| Chess Logic | chess.js |
| Markdown | react-markdown + remark-gfm |
| Backend | Express 5 + TypeScript |
| Auth | Custom HMAC token (no JWT library) |
| Database | Local JSON files (zero dependencies) |
| Monorepo | pnpm workspaces |

---

## Quick Start

**Requirements**: Node.js 20+, pnpm

```bash
# Install dependencies
pnpm install

# Start API server (port 8080) and frontend (port 19953) together
PORT=8080 pnpm --filter @workspace/api-server run dev &
PORT=19953 BASE_PATH=/ pnpm --filter @workspace/chess-academy run dev
```

Open **http://localhost:19953** in your browser. Register an account — data is saved automatically to `artifacts/api-server/data/`.

---

## Project Structure

```
/
├── artifacts/
│   ├── api-server/              # Express 5 backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts       # Login, register, profile
│   │   │   │   ├── lessons.ts    # All 30 lesson definitions + endpoints
│   │   │   │   ├── openings.ts   # Opening data endpoints
│   │   │   │   ├── traps.ts      # Trap data (19 traps)
│   │   │   │   ├── progress.ts   # User progress tracking
│   │   │   │   ├── leaderboard.ts
│   │   │   │   └── users.ts      # Public profile API
│   │   │   └── lib/
│   │   │       ├── auth.ts       # HMAC token + password hashing
│   │   │       └── jsonDb.ts     # File-based JSON storage
│   │   └── data/
│   │       ├── DATABASE.JSON      # Openings + progress records
│   │       └── DATABASEUSER.JSON  # User accounts
│   │
│   └── chess-academy/           # React + Vite frontend
│       └── src/
│           ├── pages/            # All page components
│           ├── components/       # Navbar, layout, UI
│           └── hooks/            # use-auth.ts, use-chess.ts
│
└── shared/                      # Shared TypeScript types
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/lessons` | No | All 30 lessons |
| GET | `/api/lessons/:id` | No | Single lesson |
| GET | `/api/openings` | No | All openings |
| GET | `/api/openings/:id` | No | Single opening |
| GET | `/api/traps` | No | All 19 traps |
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/auth/me` | Yes | Current user |
| PATCH | `/api/auth/profile` | Yes | Update profile |
| POST | `/api/auth/change-password` | Yes | Change password |
| GET | `/api/progress` | Yes | User progress |
| POST | `/api/progress/lesson` | Yes | Complete a lesson |
| POST | `/api/progress/opening` | Yes | Study an opening |
| GET | `/api/leaderboard` | No | Top players by ELO |
| GET | `/api/users/:id` | No | Public user profile |

---

## Elite Lessons (2000+ ELO)

Five advanced masterclasses unlock when your rating reaches 2000:

| # | Title | Duration |
|---|-------|----------|
| 26 | How Grandmasters Think | 35 min |
| 27 | Deep Endgame Theory | 40 min |
| 28 | Advanced Attack Theory | 38 min |
| 29 | Opening Preparation in the Computer Era | 30 min |
| 30 | World Champion Techniques | 45 min |

---

## Authentication

- Passwords hashed with **SHA-256 + salt** (no plaintext ever stored)
- Auth tokens are **HMAC-signed** (no JWT library needed)
- Token stored in `localStorage` as `chess_academy_token`

---

## Data Storage

All data is stored as plain **JSON files** — no PostgreSQL, MongoDB, or Redis needed.

| File | Contents |
|------|----------|
| `DATABASE.JSON` | Openings + per-user progress records |
| `DATABASEUSER.JSON` | User accounts, passwords, profile settings |

Back up your data by copying two files. Self-host anywhere with just Node.js.

---

## Credits

Designed & developed by **Artin Zomorodian**

---

*"Chess is the art of analysis." — Mikhail Botvinnik*
