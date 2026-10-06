"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      const query = q.trim();
      router.replace(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
    }, 400);
    return () => clearTimeout(t);
  }, [q, router]);

  return (
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Buscar filmes ou séries..."
      autoFocus
      className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-teal-500"
    />
  );
}
