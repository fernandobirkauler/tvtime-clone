import { tmdb, img } from "@/lib/tmdb";
import { getSessionUser } from "@/lib/auth";
import StatusButtons from "@/components/StatusButtons";
import RemoveButton from "@/components/RemoveButton";
import { readList, readWatched, readAbandoned } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await tmdb(`/movie/${id}`);
  const user = await getSessionUser().catch(() => null);
  const list = user ? await readList(user.id) : [];
  const watched = user ? await readWatched(user.id) : [];
  const inList = list.some((i) => i.id === movie.id && i.media_type === "movie");
  const isWatched = watched.some((i) => i.id === movie.id && i.media_type === "movie");
  const abandoned = user ? await readAbandoned(user.id) : [];
  const inAbandoned = abandoned.some((i) => i.id === movie.id && i.media_type === "movie");
  return (
    <div>
      {movie.backdrop_path && (
        <div className="relative -mx-4 -mt-6 mb-6 h-64 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(movie.backdrop_path, "w1280")} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(movie.poster_path)} alt={movie.title} className="w-full sm:w-64 rounded-lg" />
      <div>
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="text-zinc-400 mt-1">⭐ {movie.vote_average?.toFixed?.(1)} · {movie.release_date}</p>
        <p className="mt-4 text-zinc-300">{movie.overview}</p>
        <div className="mt-6 flex gap-3">
          {user && (
            <>
              <StatusButtons
                initial={isWatched ? "watched" : inList ? "watchlist" : inAbandoned ? "abandoned" : null}
                item={{ id: movie.id, media_type: "movie", title: movie.title, poster_path: movie.poster_path, vote_average: movie.vote_average, runtime: movie.runtime ?? 0 }}
              />
              <RemoveButton item={{ id: movie.id, media_type: "movie" }} />
            </>
          )}
        </div>
        {movie.runtime ? <p className="mt-3 text-sm text-zinc-400">Duração: {movie.runtime} min</p> : null}
        </div>
      </div>
    </div>
  );
}
