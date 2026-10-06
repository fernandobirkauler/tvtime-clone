import crypto from "crypto";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

export function hashPassword(pw: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  return crypto.scryptSync(pw, salt, 64).toString("hex") === hash;
}

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  await query("INSERT INTO sessions (token, user_id) VALUES (?, ?)", [token, userId]);
  const jar = await cookies();
  jar.set("session", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  if (token) await query("DELETE FROM sessions WHERE token = ?", [token]);
  jar.delete("session");
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  if (!token) return null;
  const rows: any[] = await query(
    "SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? LIMIT 1",
    [token]
  );
  return rows[0] ?? null;
}
