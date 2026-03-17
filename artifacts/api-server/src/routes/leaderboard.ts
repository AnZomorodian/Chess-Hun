import { Router } from "express";
import { readDb } from "../lib/jsonDb.js";
import { verifyToken, extractToken } from "../lib/auth.js";

const router = Router();

interface UserRecord {
  id: string;
  username: string;
  displayName: string;
  level: string;
  rating: number;
  lessonsCompleted: number;
  openingsStudied: number;
  joinedAt: string;
  avatarColor?: string;
  hideFromLeaderboard?: boolean;
  chessAccounts?: { platform: string; username: string }[];
}

interface UserProgress {
  userId: string;
  completedLessons: string[];
  completedOpenings: string[];
  totalPoints: number;
  streak: number;
}

router.get("/", (req, res) => {
  const token = extractToken(req.headers.authorization);
  const currentUserId = token ? verifyToken(token) : null;

  const usersDb = readDb<{ users: UserRecord[] }>("DATABASEUSER.JSON", { users: [] });
  const progressRaw = readDb<Record<string, unknown>>("DATABASE.JSON", {});
  const progressList: UserProgress[] = Array.isArray(progressRaw.progress) ? (progressRaw.progress as UserProgress[]) : [];

  const progressMap = new Map(progressList.map((p) => [p.userId, p]));

  const leaderboard = usersDb.users
    .filter((u) => !u.hideFromLeaderboard || u.id === currentUserId)
    .map((u) => {
      const prog = progressMap.get(u.id);
      return {
        id: u.id,
        username: u.username,
        displayName: u.displayName || u.username,
        level: u.level,
        rating: u.rating,
        avatarColor: u.avatarColor ?? "gold",
        lessonsCompleted: prog?.completedLessons?.length ?? 0,
        openingsStudied: prog?.completedOpenings?.length ?? 0,
        totalPoints: prog?.totalPoints ?? 0,
        streak: prog?.streak ?? 0,
        isCurrentUser: u.id === currentUserId,
        chessAccounts: u.chessAccounts ?? [],
      };
    });

  leaderboard.sort((a, b) => b.rating - a.rating);

  res.json({ leaderboard: leaderboard.slice(0, 50) });
});

export default router;
