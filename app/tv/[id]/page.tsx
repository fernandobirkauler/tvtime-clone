import { tmdb, img } from "@/lib/tmdb";
import { getSessionUser } from "@/lib/auth";
import StatusButtons from "@/components/StatusButtons";
import WatchedButton from "@/components/WatchedButton";
import RemoveButton from "@/components/RemoveButton";
import { readList, readWatched, readAbandoned } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function TvPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await tmdb(`/tv/${id}`);
  const user = await getSessionUser().catch(() => null);
  const list = user ? await readList(user.id) : [];
  const watched = user ? await readWatched(user.id) : [];
  const inList = list.some((i) => i.id === show.id && i.media_type === "tv");
  const abandonedList = user ? await readAbandoned(user.id) : [];
  const inAbandoned = abandonedList.some((i) => i.id === show.id && i.media_type === "tv");
  const isShowWatched = watched.some((i) => i.id === show.id && i.media_type === "tv");
  const seasons: any[] = (show.seasons ?? []).filter((s: any) => s.season_number > 0);
  const seasonDetails = await Promise.all(
    seasons.map((s: any) => tmdb(`/tv/${id}/season/${s.season_number}`).catch(() => null))
  );
  return (
    <div>
      {show.backdrop_path && (
        <div className="relative -mx-4 -mt-6 mb-6 h-64 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(show.backdrop_path, "w1280")} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(show.poster_path)} alt={show.name} className="w-full sm:w-64 rounded-lg" />
        <div>
          <h1 className="text-3xl font-bold">{show.name}</h1>
          <p className="text-zinc-400 mt-1">⭐ {show.vote_average?.toFixed?.(1)} · {show.first_air_date}</p>
          <p className="mt-4 text-zinc-300">{show.overview}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {user && (
              <>
                <StatusButtons
                  initial={inList ? "watchlist" : inAbandoned ? "abandoned" : isShowWatched ? "watched" : null}
                  item={{ id: show.id, media_type: "tv", title: show.name, poster_path: show.poster_path, vote_average: show.vote_average }}
                />
                <RemoveButton item={{ id: show.id, media_type: "tv" }} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Episódios</h2>
        {seasonDetails.map(
          (season) =>
            season && (
              <div key={season.id} className="mb-6">
                <h3 className="font-semibold text-zinc-300 mb-2">{season.name}</h3>
                <ul className="divide-y divide-zinc-900">
                  {(season.episodes ?? []).map((ep: any) => {
                    const isWatched = watched.some((i) => i.id === ep.id && i.media_type === "tv");
                    return (
                      <li key={ep.id} className="flex items-center justify-between py-2 gap-4">
                        <span className="text-sm">
                          E{String(ep.episode_number).padStart(2, "0")} · {ep.name}
                          <span className="text-zinc-500"> · {ep.runtime ?? "?"} min</span>
                        </span>
                        {user && (
                          <WatchedButton
                          watched={isWatched}
                          item={{
                            id: ep.id,
                            media_type: "tv",
                            title: `${show.name} — S${String(ep.season_number).padStart(2, "0")}E${String(ep.episode_number).padStart(2, "0")} ${ep.name}`,
                            runtime: ep.runtime ?? 0,
                            poster_path: show.poster_path,
                            showId: show.id,
                            showTitle: show.name,
                          }}
                        />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
        )}
      </div>
    </div>
  );
}
