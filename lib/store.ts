import { query } from "@/lib/db";

export type Item = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number;
};

export type Watched = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  runtime: number; // minutos
  watchedAt: string;
  showId?: number;
  showTitle?: string;
};

export async function readList(userId: number): Promise<Item[]> {
  const rows: any[] = await query(
    "SELECT media_id AS id, media_type, title, poster_path, vote_average FROM user_media WHERE user_id = ? AND status = 'watchlist'",
    [userId]
  );
  return rows;
}

export async function readWatched(userId: number): Promise<Watched[]> {
  const rows: any[] = await query(
    "SELECT media_id AS id, media_type, title, poster_path, runtime, watched_at AS watchedAt, show_id AS showId, show_title AS showTitle FROM user_media WHERE user_id = ? AND status = 'watched'",
    [userId]
  );
  return rows.map((r) => ({ ...r, watchedAt: r.watchedAt ? new Date(r.watchedAt).toISOString() : null }));
}

export async function readAbandoned(userId: number): Promise<Item[]> {
  const rows: any[] = await query(
    "SELECT media_id AS id, media_type, title, poster_path, vote_average FROM user_media WHERE user_id = ? AND status = 'abandoned'",
    [userId]
  );
  return rows;
}

export async function addToStatus(userId: number, status: "watchlist" | "watched" | "abandoned", item: any) {
  await query(
    `INSERT INTO user_media (user_id, media_type, media_id, title, poster_path, vote_average, runtime, status, watched_at, show_id, show_title)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title)`,
    [
      userId,
      item.media_type,
      item.id,
      item.title,
      item.poster_path ?? null,
      item.vote_average ?? null,
      item.runtime ?? null,
      status,
      status === "watched" ? (item.watchedAt ? new Date(item.watchedAt) : new Date()) : null,
      item.showId ?? null,
      item.showTitle ?? null,
    ]
  );
}

export async function removeFromStatus(userId: number, status: "watchlist" | "watched" | "abandoned", item: any) {
  await query(
    "DELETE FROM user_media WHERE user_id = ? AND status = ? AND media_type = ? AND media_id = ?",
    [userId, status, item.media_type, item.id]
  );
}

export async function removeFromAll(userId: number, item: any) {
  await query(
    "DELETE FROM user_media WHERE user_id = ? AND media_type = ? AND (media_id = ? OR show_id = ?)",
    [userId, item.media_type, item.id, item.id]
  );
}
