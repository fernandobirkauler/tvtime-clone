"use client";

import { useState } from "react";

type Status = "watchlist" | "watched" | "abandoned" | null;

const ENDPOINTS: Record<string, string> = {
  watchlist: "/api/watchlist",
  watched: "/api/watched",
  abandoned: "/api/abandoned",
};

const LABELS: Record<string, string> = {
  watchlist: "Quero assistir",
  watched: "Assistido",
  abandoned: "Abandonado",
};

export default function StatusButtons({
  item,
  initial,
}: {
  item: {
    id: number;
    media_type: "movie" | "tv";
    title: string;
    poster_path?: string | null;
    vote_average?: number;
    runtime?: number;
  };
  initial: Status;
}) {
  const [status, setStatus] = useState<Status>(initial);
  const [loading, setLoading] = useState(false);

  async function set(next: Status) {
    // Uma vez marcado como assistido, não dá para desmarcar pelo botão (use "Remover")
    if (status === "watched" && next === "watched") return;
    setLoading(true);
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(item);
    if (status && status !== next) {
      await fetch(ENDPOINTS[status], { method: "DELETE", headers, body });
    }
    if (next) {
      await fetch(ENDPOINTS[next], { method: status === next ? "DELETE" : "POST", headers, body });
      setStatus(status === next ? null : next);
    } else {
      setStatus(null);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(item.media_type === "tv"
        ? status === "watchlist"
          ? (["abandoned"] as Status[])
          : (["watchlist"] as Status[])
        : (["watchlist", "watched"] as Status[])
      ).map((s) => (
        <button
          key={s}
          disabled={loading}
          onClick={() => set(s)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            status === s
              ? "bg-teal-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {s === "abandoned"
            ? "Abandonar"
            : s === "watchlist" && item.media_type === "tv"
              ? status === "abandoned"
                ? "Retomar"
                : "Adicionar"
              : LABELS[s!]}
        </button>
      ))}
    </div>
  );
}
