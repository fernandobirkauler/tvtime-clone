"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkWatchedButton({
  item,
}: {
  item: {
    id: number;
    media_type: "movie" | "tv";
    title: string;
    runtime: number;
    poster_path?: string | null;
    showId?: number;
    showTitle?: string;
  };
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function mark() {
    setLoading(true);
    await fetch("/api/watched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      disabled={loading}
      onClick={mark}
      className="rounded-full px-4 py-2 text-sm font-semibold bg-teal-600 text-white hover:bg-teal-500 transition disabled:opacity-50"
    >
      {loading ? "Salvando..." : "Marcar como visto"}
    </button>
  );
}
