import { Router } from "express";
import { readDb, writeDb } from "../lib/jsonDb.js";
import { hashPassword, generateToken, verifyToken, extractToken } from "../lib/auth.js";

const router = Router();

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

interface ChessAccount {
  platform: string;
  username: string;
}

interface UserRecord {
  id: string;
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
  level: string;
  rating: number;
  lessonsCompleted: number;
  openingsStudied: number;
  joinedAt: string;
  bio?: string;
  country?: string;
  favoriteOpening?: string;
  preferredSide?: "White" | "Black" | "Both";
  avatarColor?: string;
  hideFromLeaderboard?: boolean;
  chessAccounts?: ChessAccount[];
  displayNameChangedAt?: string;
}

interface UsersDb {
  users: UserRecord[];
}

function getUsers(): UsersDb {
  return readDb<UsersDb>("DATABASEUSER.JSON", { users: [] });
}

function saveUsers(db: UsersDb): void {
  writeDb("DATABASEUSER.JSON", db);
}

function toProfile(u: UserRecord) {
  const now = Date.now();
  const lastChanged = u.displayNameChangedAt ? new Date(u.displayNameChangedAt).getTime() : 0;
  const nextAllowedChange = lastChanged + THREE_DAYS_MS;
  const canChangeName = now >= nextAllowedChange;
  const nextNameChangeAt = canChangeName ? null : new Date(nextAllowedChange).toISOString();

  return {
    id: u.id,
    username: u.username,
    email: u.email,
    displayName: u.displayName || u.username,
    level: u.level,
    rating: u.rating,
    lessonsCompleted: u.lessonsCompleted,
    openingsStudied: u.openingsStudied,
    joinedAt: u.joinedAt,
    bio: u.bio ?? "",
    country: u.country ?? "",
    favoriteOpening: u.favoriteOpening ?? "",
    preferredSide: u.preferredSide ?? "Both",
    avatarColor: u.avatarColor ?? "gold",
    hideFromLeaderboard: u.hideFromLeaderboard ?? false,
    chessAccounts: u.chessAccounts ?? [],
    canChangeName,
    nextNameChangeAt,
  };
}

router.post("/register", (req, res) => {
  const { username, email, password, displayName } = req.body as {
    username?: string;
    email?: string;
    password?: string;
    displayName?: string;
  };

  if (!username || !email || !password) {
    res.status(400).json({ error: "username, email and password are required" });
    return;
  }

  const db = getUsers();
  const existing = db.users.find(
    (u) => u.username === username || u.email === email
  );

  if (existing) {
    res.status(400).json({ error: "Username or email already taken" });
    return;
  }

  const newUser: UserRecord = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    username,
    email,
    displayName: displayName || username,
    passwordHash: hashPassword(password),
    level: "Beginner",
    rating: 800,
    lessonsCompleted: 0,
    openingsStudied: 0,
    joinedAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveUsers(db);

  const token = generateToken(newUser.id);
  res.status(201).json({ token, user: toProfile(newUser) });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    res.status(400).json({ error: "username and password are required" });
    return;
  }

  const db = getUsers();
  const user = db.users.find((u) => u.username === username);

  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = generateToken(user.id);
  res.json({ token, user: toProfile(user) });
});

router.get("/me", (req, res) => {
  const token = extractToken(req.headers.authorization);
  if (!token) { res.status(401).json({ error: "No token provided" }); return; }
  const userId = verifyToken(token);
  if (!userId) { res.status(401).json({ error: "Invalid or expired token" }); return; }
  const db = getUsers();
  const user = db.users.find((u) => u.id === userId);
  if (!user) { res.status(401).json({ error: "User not found" }); return; }
  res.json(toProfile(user));
});

router.patch("/profile", (req, res) => {
  const token = extractToken(req.headers.authorization);
  if (!token) { res.status(401).json({ error: "No token provided" }); return; }
  const userId = verifyToken(token);
  if (!userId) { res.status(401).json({ error: "Invalid or expired token" }); return; }

  const {
    displayName,
    bio,
    country,
    favoriteOpening,
    preferredSide,
    avatarColor,
    hideFromLeaderboard,
    chessAccounts,
  } = req.body as {
    displayName?: string;
    bio?: string;
    country?: string;
    favoriteOpening?: string;
    preferredSide?: "White" | "Black" | "Both";
    avatarColor?: string;
    hideFromLeaderboard?: boolean;
    chessAccounts?: ChessAccount[];
  };

  const db = getUsers();
  const user = db.users.find((u) => u.id === userId);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  if (displayName !== undefined) {
    const trimmed = displayName.trim() || user.username;
    if (trimmed !== user.displayName) {
      const now = Date.now();
      const lastChanged = user.displayNameChangedAt ? new Date(user.displayNameChangedAt).getTime() : 0;
      if (now - lastChanged < THREE_DAYS_MS) {
        const nextAllowed = new Date(lastChanged + THREE_DAYS_MS).toISOString();
        res.status(429).json({
          error: "Display name can only be changed once every 3 days.",
          nextAllowedAt: nextAllowed,
        });
        return;
      }
      user.displayName = trimmed;
      user.displayNameChangedAt = new Date().toISOString();
    }
  }

  if (bio !== undefined) user.bio = bio.slice(0, 300);
  if (country !== undefined) user.country = country;
  if (favoriteOpening !== undefined) user.favoriteOpening = favoriteOpening;
  if (preferredSide !== undefined) user.preferredSide = preferredSide;
  if (avatarColor !== undefined) user.avatarColor = avatarColor;
  if (hideFromLeaderboard !== undefined) user.hideFromLeaderboard = hideFromLeaderboard;
  if (chessAccounts !== undefined) {
    user.chessAccounts = chessAccounts
      .filter((a) => a.platform && a.username.trim())
      .map((a) => ({ platform: a.platform, username: a.username.trim() }))
      .slice(0, 5);
  }

  saveUsers(db);
  res.json({ user: toProfile(user) });
});

router.patch("/password", (req, res) => {
  const token = extractToken(req.headers.authorization);
  if (!token) { res.status(401).json({ error: "No token provided" }); return; }
  const userId = verifyToken(token);
  if (!userId) { res.status(401).json({ error: "Invalid or expired token" }); return; }

  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "currentPassword and newPassword are required" });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }

  const db = getUsers();
  const user = db.users.find((u) => u.id === userId);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  if (user.passwordHash !== hashPassword(currentPassword)) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  user.passwordHash = hashPassword(newPassword);
  saveUsers(db);
  res.json({ success: true, message: "Password updated successfully" });
});

export default router;
