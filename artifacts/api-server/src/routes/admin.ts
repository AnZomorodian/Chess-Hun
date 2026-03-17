import { Router } from "express";
import { readDb, writeDb } from "../lib/jsonDb.js";
import { hashPassword } from "../lib/auth.js";
import crypto from "crypto";

const router = Router();

const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "Admin123";
const ADMIN_SECRET = "chess-academy-admin-secret";

function generateAdminToken(): string {
  const payload = { role: "admin", ts: Date.now() };
  const str = JSON.stringify(payload);
  const encoded = Buffer.from(str).toString("base64url");
  const sig = crypto.createHmac("sha256", ADMIN_SECRET).update(encoded).digest("hex");
  return `admin.${encoded}.${sig}`;
}

function verifyAdminToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || parts[0] !== "admin") return false;
    const [, encoded, sig] = parts;
    const expectedSig = crypto.createHmac("sha256", ADMIN_SECRET).update(encoded).digest("hex");
    if (sig !== expectedSig) return false;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    if (payload.role !== "admin") return false;
    return true;
  } catch {
    return false;
  }
}

function requireAdmin(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: "Invalid admin token" });
    return;
  }
  next();
}

router.post("/login", (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }
  const token = generateAdminToken();
  res.json({ token, role: "admin" });
});

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
  isBanned?: boolean;
  bannedAt?: string;
  banReason?: string;
  notes?: string;
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
function toSafeUser(u: UserRecord) {
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
    isBanned: u.isBanned ?? false,
    bannedAt: u.bannedAt,
    banReason: u.banReason,
    notes: u.notes,
  };
}

router.get("/users", requireAdmin, (_req, res) => {
  const db = getUsers();
  const safeUsers = db.users.map(toSafeUser);
  res.json({ users: safeUsers, total: safeUsers.length });
});

router.get("/stats", requireAdmin, (_req, res) => {
  const db = getUsers();
  const users = db.users;
  const avgRating = users.length
    ? Math.round(users.reduce((sum, u) => sum + (u.rating || 800), 0) / users.length)
    : 0;
  const levelCounts = users.reduce((acc: Record<string, number>, u) => {
    acc[u.level] = (acc[u.level] || 0) + 1;
    return acc;
  }, {});
  res.json({
    totalUsers: users.length,
    avgRating,
    levelCounts,
    totalLessonsCompleted: users.reduce((sum, u) => sum + (u.lessonsCompleted || 0), 0),
    totalOpeningsStudied: users.reduce((sum, u) => sum + (u.openingsStudied || 0), 0),
    bannedUsers: users.filter((u) => u.isBanned).length,
  });
});

router.delete("/users/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getUsers();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const removed = db.users[idx];
  db.users.splice(idx, 1);
  saveUsers(db);
  res.json({ success: true, message: `User "${removed.username}" deleted.` });
});

router.post("/users/:id/ban", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { reason } = req.body as { reason?: string };
  const db = getUsers();
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  user.isBanned = true;
  user.bannedAt = new Date().toISOString();
  user.banReason = reason || "Violated community guidelines";
  saveUsers(db);
  res.json({ success: true, user: toSafeUser(user) });
});

router.post("/users/:id/unban", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getUsers();
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  user.isBanned = false;
  delete user.bannedAt;
  delete user.banReason;
  saveUsers(db);
  res.json({ success: true, user: toSafeUser(user) });
});

router.post("/users/:id/reset-progress", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getUsers();
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  user.lessonsCompleted = 0;
  user.openingsStudied = 0;
  user.rating = 800;
  saveUsers(db);
  res.json({ success: true, user: toSafeUser(user) });
});

router.patch("/users/:id/notes", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { notes } = req.body as { notes?: string };
  const db = getUsers();
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  user.notes = notes ?? "";
  saveUsers(db);
  res.json({ success: true, user: toSafeUser(user) });
});

export default router;
