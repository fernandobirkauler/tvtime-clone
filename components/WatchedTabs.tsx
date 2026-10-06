"use client";

import { useState } from "react";

type Watched = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  watchedAt: string;
};

export default function WatchedTabs({
  movies,
  series,
}: {
  movies: Watched[];
  series: Watched[];
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
      {items.length === 0 ? (
        <p className="text-zinc-400">Nenhum item aqui ainda.</p>
      ) : (
        <ul className="mb-8 divide-y divide-zinc-900">
          {items.map((w) => (
            <li
              key={`${w.media_type}-${w.id}-${w.watchedAt}`}
              className="py-2 flex justify-between text-sm"
            >
              <span>{w.title}</span>
              <span className="text-zinc-500">
                {new Date(w.watchedAt).toLocaleDateString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
