import { Router } from "express";
import { readDb, writeDb } from "../lib/jsonDb.js";
import { hashPassword, generateToken, verifyToken, extractToken } from "../lib/auth.js";

const router = Router();

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
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const db = getUsers();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json(toProfile(user));
});

export default router;
