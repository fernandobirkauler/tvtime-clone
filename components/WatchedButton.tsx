"use client";
import { useState } from "react";

export default function WatchedButton({
  item,
  watched,
}: {
  item: {
    id: number;
    media_type: "movie" | "tv";
    title: string;
    poster_path?: string | null;
    runtime: number;
    showId?: number;
    showTitle?: string;
  };
  watched: boolean;
}) {
  const [isWatched, setIsWatched] = useState(watched);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/watched", {
      method: isWatched ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) setIsWatched(!isWatched);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        isWatched ? "bg-teal-700 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
      }`}
    >
      {isWatched ? "✓ Visto" : "Marcar visto"}
    </button>
  );
}
