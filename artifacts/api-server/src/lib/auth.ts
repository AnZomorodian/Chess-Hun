import crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "chess-academy-salt").digest("hex");
}

export function generateToken(userId: string): string {
  const payload = { userId, ts: Date.now() };
  const str = JSON.stringify(payload);
  const encoded = Buffer.from(str).toString("base64url");
  const sig = crypto.createHmac("sha256", "chess-academy-secret").update(encoded).digest("hex");
  return `${encoded}.${sig}`;
}

export function verifyToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expectedSig = crypto.createHmac("sha256", "chess-academy-secret").update(encoded).digest("hex");
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    return payload.userId as string;
  } catch {
    return null;
  }
}

export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);
  return authHeader;
}
