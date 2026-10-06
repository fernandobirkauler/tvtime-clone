"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RemoveButton({
  item,
}: {
  item: { id: number; media_type: "movie" | "tv" };
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function remove() {
    setLoading(true);
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(item);
    await Promise.all([
      fetch("/api/watchlist", { method: "DELETE", headers, body }),
      fetch("/api/abandoned", { method: "DELETE", headers, body }),
      fetch("/api/watched", { method: "DELETE", headers, body }),
    ]);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      disabled={loading}
      onClick={remove}
      className="rounded-full px-4 py-2 text-sm font-semibold bg-zinc-800 text-red-400 hover:bg-zinc-700 transition disabled:opacity-50"
    >
      {loading ? "Removendo..." : "Remover"}
    </button>
  );
}
