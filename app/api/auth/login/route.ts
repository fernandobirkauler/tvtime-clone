import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const rows: any[] = await query("SELECT id, password_hash FROM users WHERE email = ?", [email]);
  const user = rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
