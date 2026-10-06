import Link from "next/link";
import { img } from "@/lib/tmdb";

export default function Card({ item }: { item: any }) {
  const type = item.media_type === "tv" ? "tv" : "movie";
  const title = item.title || item.name;
  return (
    <Link
      href={`/${type}/${item.id}`}
      className="group rounded-lg overflow-hidden bg-zinc-900 hover:ring-2 ring-teal-500 transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(item.poster_path)} alt={title} className="aspect-[2/3] w-full object-cover" />
      <div className="p-2">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-xs text-zinc-400">⭐ {item.vote_average?.toFixed?.(1) ?? "-"}</p>
      </div>
    </Link>
  );
}
