"use client";

import { useState } from "react";
import Card from "@/components/Card";
import MarkWatchedButton from "@/components/MarkWatchedButton";
import { img } from "@/lib/tmdb";

type Groups = {
  watched: any[];
  watchlist: any[];
  abandoned: any[];
  next?: any[];
};

export default function CollectionTabs({
  movies,
  series,
}: {
  movies: Groups;
  series: Groups;
}) {
  const [tab, setTab] = useState<"movies" | "series">("movies");
  const movieSections = [
    { title: "Assistidos", items: movies.watched },
    { title: "Quero assistir", items: movies.watchlist },
  ];
  const seriesSections = [
    { title: "Assistindo", items: series.watched, kind: "cards" },
    { title: "Próximo", items: series.next ?? [], kind: "next" },
    { title: "Quero assistir", items: series.watchlist, kind: "cards" },
    { title: "Abandonada", items: series.abandoned, kind: "cards" },
  ];
  const sections = tab === "movies" ? movieSections : seriesSections;

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-zinc-800">
        <button
          onClick={() => setTab("movies")}
          className={`px-4 py-2 -mb-px border-b-2 ${
            tab === "movies"
              ? "border-teal-500 text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Filmes
        </button>
        <button
          onClick={() => setTab("series")}
          className={`px-4 py-2 -mb-px border-b-2 ${
            tab === "series"
              ? "border-teal-500 text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Séries
        </button>
      </div>
      {sections.map((section) => (
        <div key={section.title} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
          {section.items.length === 0 ? (
            <p className="text-zinc-400">Nenhum item ainda.</p>
          ) : (section as any).kind === "next" ? (
            <ul className="divide-y divide-zinc-900">
              {section.items.map((ep: any) => (
                <li key={ep.id} className="py-3 flex items-center justify-between gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img(ep.still_path ?? null, "w342")}
                    alt=""
                    className="h-16 w-28 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {ep.showTitle} · S{String(ep.season_number).padStart(2, "0")}E{String(ep.episode_number).padStart(2, "0")} — {ep.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {ep.air_date} · {ep.runtime} min
                    </p>
                  </div>
                  <MarkWatchedButton item={ep} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {section.items.map((item: any) => (
                <Card key={`${item.media_type}-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
