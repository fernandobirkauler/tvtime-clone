import { tmdb } from "@/lib/tmdb";
import Pager from "@/components/Pager";
import MediaTabs from "@/components/MediaTabs";
import SearchBox from "@/components/SearchBox";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  let items: any[] = [];
  let totalPages = 1;
  if (q) {
    const data = await tmdb("/search/multi", { query: q, page: String(current) });
    items = (data.results ?? []).filter(
      (r: any) => r.media_type === "movie" || r.media_type === "tv"
    );
    totalPages = Math.min(data.total_pages ?? 1, 500);
  }
  return (
    <div>
      <div className="mb-6">
        <SearchBox defaultValue={q} />
      </div>
      <MediaTabs
        movies={items.filter((i) => i.media_type === "movie")}
        series={items.filter((i) => i.media_type === "tv")}
      />
      {q && <Pager page={current} totalPages={totalPages} base="/search" q={q} />}
    </div>
  );
}
