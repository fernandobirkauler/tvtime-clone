import { readList, readWatched, readAbandoned } from "@/lib/store";
import CollectionTabs from "@/components/CollectionTabs";
import { tmdb } from "@/lib/tmdb";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const byType = (items: any[], type: "movie" | "tv") =>
  items.filter((i) => i.media_type === type);

// Agrupa episódios assistidos por série e exibe um card por série
function groupWatchedSeries(watched: any[], abandoned: any[]) {
  const abandonedIds = new Set(abandoned.map((a: any) => a.id));
  const bySeries = new Map<number | string, any>();
  for (const w of watched) {
    if (w.media_type !== "tv") continue;
    const key = w.showId ?? w.title.split(" — S")[0];
    if (!bySeries.has(key)) {
      bySeries.set(key, {
        id: w.showId,
        media_type: "tv",
        title: w.showTitle ?? w.title.split(" — S")[0],
        poster_path: w.poster_path,
      });
    }
  }
  return [...bySeries.values()].filter((s) => !abandonedIds.has(s.id));
}

// Próximo episódio: primeiro episódio ainda não marcado como visto
async function nextEpisodes(watchedSeries: any[], watched: any[]) {
  const results: any[] = [];
  await Promise.all(
    watchedSeries.map(async (show) => {
      if (!show.id) return;
      try {
        const watchedIds = new Set(
          watched
            .filter((w: any) => w.media_type === "tv" && w.showId === show.id)
            .map((w: any) => w.id)
        );
        const d = await tmdb(`/tv/${show.id}`);
        const nextEp = d.next_episode_to_air;
        if (nextEp && !watchedIds.has(nextEp.id)) {
          results.push({
            id: nextEp.id,
            media_type: "tv",
            showId: show.id,
            showTitle: show.title,
            title: `${show.title} — S${String(nextEp.season_number).padStart(2, "0")}E${String(nextEp.episode_number).padStart(2, "0")} ${nextEp.name}`,
            season_number: nextEp.season_number,
            episode_number: nextEp.episode_number,
            name: nextEp.name,
            air_date: nextEp.air_date,
            runtime: nextEp.runtime ?? 0,
            poster_path: show.poster_path,
            still_path: nextEp.still_path,
          });
          return;
        }
        const seasons = (d.seasons ?? []).filter((s: any) => s.season_number > 0);
        for (const s of seasons) {
          const season = await tmdb(`/tv/${show.id}/season/${s.season_number}`).catch(() => null);
          if (!season) continue;
          const ep = (season.episodes ?? []).find((e: any) => !watchedIds.has(e.id));
          if (ep) {
            results.push({
              id: ep.id,
              media_type: "tv",
              showId: show.id,
              showTitle: show.title,
              title: `${show.title} — S${String(ep.season_number).padStart(2, "0")}E${String(ep.episode_number).padStart(2, "0")} ${ep.name}`,
              season_number: ep.season_number,
              episode_number: ep.episode_number,
              name: ep.name,
              air_date: ep.air_date,
              runtime: ep.runtime ?? 0,
              poster_path: show.poster_path,
              still_path: ep.still_path,
            });
            return;
          }
        }
      } catch {
        // ignore
      }
    })
  );
  return results;
}

export default async function WatchlistPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const list = await readList(user.id);
  const watched = await readWatched(user.id);
  const abandoned = await readAbandoned(user.id);
  const watching = groupWatchedSeries(watched, abandoned);
  const next = await nextEpisodes(watching, watched);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      <CollectionTabs
        movies={{
          watched: byType(watched, "movie"),
          watchlist: byType(list, "movie"),
          abandoned: byType(abandoned, "movie"),
        }}
        series={{
          watched: watching,
          watchlist: byType(list, "tv").filter(
            (i: any) => !watching.some((w: any) => w.id === i.id)
          ),
          abandoned: byType(abandoned, "tv"),
          next,
        }}
      />
    </div>
  );
}
