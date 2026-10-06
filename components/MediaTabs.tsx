"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function MediaTabs({
  movies,
  series,
}: {
  movies: any[];
  series: any[];
}) {
  const [tab, setTab] = useState<"movies" | "series">("movies");
  const items = tab === "movies" ? movies : series;
  return (
    <div>
      <div className="mb-4 flex gap-2 border-b border-zinc-800">
        <button
          onClick={() => setTab("movies")}
          className={`px-4 py-2 -mb-px border-b-2 ${
            tab === "movies"
              ? "border-teal-500 text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Filmes ({movies.length})
        </button>
        <button
          onClick={() => setTab("series")}
          className={`px-4 py-2 -mb-px border-b-2 ${
            tab === "series"
              ? "border-teal-500 text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Séries ({series.length})
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item: any) => (
          <Card key={`${item.media_type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}
