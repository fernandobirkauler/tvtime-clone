import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { readWatched, addToStatus, removeFromStatus } from "@/lib/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json([], { status: 401 });
  return NextResponse.json(await readWatched(user.id));
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "não autenticado" }, { status: 401 });
  const item = await req.json();
  await addToStatus(user.id, "watched", item);
  return NextResponse.json(await readWatched(user.id));
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "não autenticado" }, { status: 401 });
  const item = await req.json();
  await removeFromStatus(user.id, "watched", item);
  return NextResponse.json(await readWatched(user.id));
}
