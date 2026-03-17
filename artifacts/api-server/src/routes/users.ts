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
  bio?: string;
  country?: string;
  favoriteOpening?: string;
  preferredSide?: string;
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

router.get("/:id", (req, res) => {
  const token = extractToken(req.headers.authorization);
  const requesterId = token ? verifyToken(token) : null;

  const usersDb = readDb<{ users: UserRecord[] }>("DATABASEUSER.JSON", { users: [] });
  const user = usersDb.users.find((u) => u.id === req.params["id"]);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const isSelf = requesterId === user.id;

  if (user.hideFromLeaderboard && !isSelf) {
    res.status(403).json({ error: "This user's profile is private" });
    return;
  }

  const progressRaw = readDb<Record<string, unknown>>("DATABASE.JSON", {});
  const progressList: UserProgress[] = Array.isArray(progressRaw.progress)
    ? (progressRaw.progress as UserProgress[])
    : [];
  const prog = progressList.find((p) => p.userId === user.id);

  res.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName || user.username,
    level: user.level,
    rating: user.rating,
    avatarColor: user.avatarColor ?? "gold",
    joinedAt: user.joinedAt,
    bio: user.bio ?? "",
    country: user.country ?? "",
    favoriteOpening: user.favoriteOpening ?? "",
    preferredSide: user.preferredSide ?? "Both",
    chessAccounts: user.chessAccounts ?? [],
    lessonsCompleted: prog?.completedLessons?.length ?? 0,
    openingsStudied: prog?.completedOpenings?.length ?? 0,
    totalPoints: prog?.totalPoints ?? 0,
    streak: prog?.streak ?? 0,
    isSelf,
  });
});

export default router;
