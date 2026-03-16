import { Router } from "express";
import { readDb, writeDb } from "../lib/jsonDb.js";
import { verifyToken, extractToken } from "../lib/auth.js";

const router = Router();

interface UserProgress {
  userId: string;
  completedLessons: string[];
  completedOpenings: string[];
  totalPoints: number;
  streak: number;
  lastActive: string;
}

interface ProgressDb {
  progress: UserProgress[];
}

function getProgressDb(): ProgressDb {
  const data = readDb<Record<string, unknown>>("DATABASE.JSON", {});
  const progress = Array.isArray(data.progress) ? (data.progress as UserProgress[]) : [];
  return { progress };
}

function saveProgressDb(db: ProgressDb): void {
  const existing = readDb<Record<string, unknown>>("DATABASE.JSON", {});
  writeDb("DATABASE.JSON", { ...existing, progress: db.progress });
}

function getUserProgress(userId: string): UserProgress {
  const db = getProgressDb();
  const existing = db.progress.find((p) => p.userId === userId);
  if (existing) return existing;
  return {
    userId,
    completedLessons: [],
    completedOpenings: [],
    totalPoints: 0,
    streak: 1,
    lastActive: new Date().toISOString(),
  };
}

router.get("/", (req, res) => {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  res.json(getUserProgress(userId));
});

router.post("/", (req, res) => {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const { lessonId, openingId, pointsEarned } = req.body as {
    lessonId?: string;
    openingId?: string;
    pointsEarned?: number;
  };

  const db = getProgressDb();
  let progress = db.progress.find((p) => p.userId === userId);

  if (!progress) {
    progress = {
      userId,
      completedLessons: [],
      completedOpenings: [],
      totalPoints: 0,
      streak: 1,
      lastActive: new Date().toISOString(),
    };
    db.progress.push(progress);
  }

  if (lessonId && !progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  if (openingId && !progress.completedOpenings.includes(openingId)) {
    progress.completedOpenings.push(openingId);
  }

  if (pointsEarned) {
    progress.totalPoints += pointsEarned;
  }

  const today = new Date().toDateString();
  const lastActive = new Date(progress.lastActive).toDateString();
  if (today !== lastActive) {
    progress.streak += 1;
  }
  progress.lastActive = new Date().toISOString();

  saveProgressDb(db);

  res.json(progress);
});

export default router;
