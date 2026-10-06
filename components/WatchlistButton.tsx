"use client";
import { useState } from "react";

export default function WatchlistButton({ item, inList }: { item: any; inList: boolean }) {
  const [added, setAdded] = useState(inList);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/watchlist", {
      method: added ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, media_type: item.media_type, title: item.title, poster_path: item.poster_path, vote_average: item.vote_average }),
    });
    if (res.ok) setAdded(!added);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        added ? "bg-zinc-800 text-white" : "bg-teal-600 text-white hover:bg-teal-500"
      }`}
    >
      {added ? "✓ Na lista (remover)" : "+ Adicionar à lista"}
    </button>
  );
}
