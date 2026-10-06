import { tmdb } from "@/lib/tmdb";
import Card from "@/components/Card";

export default async function Home() {
  const [trendingTv, trendingMovies] = await Promise.all([
    tmdb("/trending/tv/week"),
    tmdb("/trending/movie/week"),
  ]);
  const topSeries = (trendingTv.results ?? []).slice(0, 10);
  const topMovies = (trendingMovies.results ?? []).slice(0, 10);
  return (
    <div>
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Séries em alta da semana — Top 10</h2>
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {topSeries.map((item: any, i: number) => (
            <li key={item.id} className="relative">
              <span className="absolute -top-2 -left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-black">
                {i + 1}
              </span>
              <Card item={{ ...item, media_type: "tv" }} />
            </li>
          ))}
        </ol>
      </section>
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Filmes em alta na semana — Top 10</h2>
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {topMovies.map((item: any, i: number) => (
            <li key={item.id} className="relative">
              <span className="absolute -top-2 -left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-black">
                {i + 1}
              </span>
              <Card item={{ ...item, media_type: "movie" }} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
