# ♟ Chess Academy

A full-stack interactive chess learning platform — beautifully designed, deeply educational, and completely self-hosted with no external database required.

![Chess Academy](https://img.shields.io/badge/Chess-Academy-gold?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZCIgZD0iTTEyIDJMOCA4SDRsMiA0LTIgMWg0bDEgM0g5bC0xIDJoOGwtMS0ySDEzbDEtM2g0bC0yLTEgMi00aC00eiIvPjwvc3ZnPg==)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## ✨ Features

### 🎓 Structured Learning
- **20+ Masterclasses** covering Beginner → Advanced topics
- Full lesson content with rich Markdown rendering (headings, tables, code)
- Interactive **multiple-choice exercises** after each lesson
- **Lesson completion system** with XP points, celebration screen, and "Up Next" progression

### ♟ Openings Library
- **20+ Chess Openings** with ECO codes, key ideas, and move sequences
- **Sicilian Defense** with 5 dedicated variants: Najdorf, Dragon, Scheveningen, Kan, Accelerated Dragon
- Sorted by **Beginner → Intermediate → Advanced** with filter buttons
- Search by name, ECO code, or category

### 👤 User System
- Register / Log In with secure token-based authentication
- **Profile page** with avatar, ELO rating, level, and stats
- **8 Achievements** that unlock as you learn
- Progress tracking: lessons completed, openings studied, points, streaks

### 📊 Dashboard
- Overall course completion progress bar
- Stats: total points, daily streak, lessons done, openings studied
- Recent activity feed

### 🎨 Design
- Stunning dark chess-themed UI with gold accents
- Smooth Framer Motion animations throughout
- Fully responsive — works on mobile, tablet, and desktop
- Glass-panel aesthetic with premium hover effects

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animations | Framer Motion |
| State | Zustand + TanStack Query |
| Backend | Express 5 + TypeScript |
| Auth | Custom HMAC token (no JWT library) |
| Database | Local JSON files (no server needed!) |
| Chess Logic | chess.js |
| Monorepo | pnpm workspaces |

---

## 🚀 Quick Start

### Requirements
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Run in 3 steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/chess-academy.git
cd chess-academy

# 2. Install dependencies
pnpm install

# 3. Start both servers
pnpm --filter @workspace/api-server run dev    # API on :8080
pnpm --filter @workspace/chess-academy run dev  # Frontend on :5173
```

Open **http://localhost:5173** in your browser.

> **First time?** Register an account — user data is saved automatically to `artifacts/api-server/data/`.

---

## 📁 Project Structure

```
chess-academy/
├── artifacts/
│   ├── api-server/          # Express 5 backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts      # Login, register, /me
│   │   │   │   ├── lessons.ts   # All lesson data + endpoints
│   │   │   │   ├── openings.ts  # All openings data + endpoints
│   │   │   │   └── progress.ts  # User progress tracking
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts      # HMAC token + password hashing
│   │   │   │   └── jsonDb.ts    # File-based JSON storage
│   │   │   └── index.ts
│   │   └── data/
│   │       ├── DATABASEUSER.JSON  # User accounts
│   │       └── DATABASE.JSON      # Openings + progress
│   │
│   └── chess-academy/       # React + Vite frontend
│       └── src/
│           ├── pages/
│           │   ├── home.tsx
│           │   ├── lessons.tsx
│           │   ├── lesson-detail.tsx
│           │   ├── openings.tsx
│           │   ├── opening-detail.tsx
│           │   ├── dashboard.tsx
│           │   ├── profile.tsx
│           │   ├── login.tsx
│           │   └── register.tsx
│           ├── hooks/
│           │   ├── use-auth.ts     # Auth state + mutations
│           │   └── use-chess.ts    # Lessons, openings, progress
│           └── components/
│               └── layout/
│                   └── Navbar.tsx
│
├── shared/                  # Shared TypeScript types
│   └── src/schema.ts
├── HOW_TO_RUN.md            # Docker + VPS + domain guide
└── README.md                # This file
```

---

## 🗄 Data Storage

All data is stored in plain **JSON files** — no PostgreSQL, no MongoDB, no Redis required.

| File | What it stores |
|------|---------------|
| `DATABASEUSER.JSON` | User accounts (username, hashed password, rating, level) |
| `DATABASE.JSON` | Chess openings library + per-user progress records |

This makes it trivially easy to:
- **Back up** your data: just copy two files
- **Self-host** anywhere: a $5/month VPS is plenty
- **Inspect** your data: open in any text editor

---

## 🔐 Authentication

- Passwords hashed with **SHA-256 + salt** (no plaintext ever stored)
- Auth tokens are **HMAC-signed** custom tokens (no JWT library dependency)
- Token stored in `localStorage` as `chess_academy_token`
- `/api/auth/me` validates the token on every protected request

---

## 📚 Lessons (20+)

| # | Title | Category | Difficulty |
|---|-------|----------|-----------|
| 1 | Understanding Piece Values | Fundamentals | Beginner |
| 2 | Basic Tactics: Forks, Pins & Skewers | Tactics | Beginner |
| 3 | King Safety & Castling | Strategy | Beginner |
| 4 | Pawn Structure Fundamentals | Strategy | Intermediate |
| 5 | Checkmate Patterns | Tactics | Intermediate |
| 6 | Endgame Basics | Endgame | Beginner |
| 7 | Opening Principles | Opening Theory | Beginner |
| 8 | Advanced Tactical Motifs | Tactics | Intermediate |
| 9 | Strategic Planning | Strategy | Intermediate |
| 10 | Rook Endgames Mastery | Endgame | Advanced |
| 11 | The Art of the Attack | Tactics | Advanced |
| 12 | Chess Psychology | Strategy | Intermediate |
| 13 | The Bishop Pair Advantage | Strategy | Intermediate |
| 14 | Calculation & Visualization | Tactics | Intermediate |
| 15 | Pawn Breaks & Structural Warfare | Strategy | Intermediate |
| 16 | Knight Maneuvers & Outposts | Strategy | Advanced |
| 17 | The Art of Defense | Strategy | Advanced |
| 18 | Queen & Pawn Endgames | Endgame | Advanced |

---

## ♟ Openings Library (20+)

**Beginner**: Italian Game, Queen's Gambit, French Defense, Caro-Kann, London System, King's Pawn

**Intermediate**: Ruy López, Scotch Game, English Opening, Nimzo-Indian, Sicilian (Open)

**Advanced**: Sicilian Najdorf, Sicilian Dragon, Sicilian Scheveningen, Sicilian Kan, Accelerated Dragon, King's Indian, Dutch Defense, Grünfeld Defense, Queen's Indian, Pirc Defense, Vienna Game

---

## 🌐 Deploying

See **[HOW_TO_RUN.md](./HOW_TO_RUN.md)** for complete guides on:

- Local development
- Docker containerization
- Docker Compose (recommended for VPS)
- Deploying to a VPS (Ubuntu/Debian)
- Setting up a custom domain with HTTPS (Let's Encrypt)
- Automated backups and updates

---

## 🤝 Contributing

Contributions are welcome! Some ideas:

- Add more chess openings with interactive board demos
- Add a puzzle mode with real chess positions
- Add multiplayer or match-play features
- Add an AI opponent using Stockfish.js
- Add a PGN game viewer

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
# Make your changes
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built with ❤️ for chess lovers everywhere. "Chess is the art of analysis." — Mikhail Botvinnik*
