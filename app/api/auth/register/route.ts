import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { addToStatus } from "@/lib/store";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
  }
  const existing: any[] = await query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
  }
  const result: any = await query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hashPassword(password)]
  );
  const userId = result.insertId;
  // Importa dados antigos dos arquivos JSON, se existirem
  try {
    const importFile = async (file: string, status: "watchlist" | "watched" | "abandoned") => {
      const p = path.join(process.cwd(), "data", file);
      if (!fs.existsSync(p)) return;
      const items = JSON.parse(fs.readFileSync(p, "utf8"));
      for (const item of items) {
        await addToStatus(userId, status, {
          ...item,
          watchedAt: item.watchedAt,
          showId: item.showId,
          showTitle: item.showTitle,
        });
      }
    };
    await importFile("watchlist.json", "watchlist");
    await importFile("watched.json", "watched");
    await importFile("abandoned.json", "abandoned");
  } catch {
    // se falhar a importação, segue
  }
  await createSession(userId);
  return NextResponse.json({ ok: true });
}
