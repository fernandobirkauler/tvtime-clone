import { readWatched } from "@/lib/store";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function format(minTotal: number) {
  const months = Math.floor(minTotal / (30 * 24 * 60));
  const days = Math.floor((minTotal % (30 * 24 * 60)) / (24 * 60));
  const hours = Math.floor((minTotal % (24 * 60)) / 60);
  const minutes = minTotal % 60;
  const parts: string[] = [];
  if (months) parts.push(`${months} ${months === 1 ? "mês" : "meses"}`);
  if (days) parts.push(`${days} ${days === 1 ? "dia" : "dias"}`);
  if (hours) parts.push(`${hours} ${hours === 1 ? "hora" : "horas"}`);
  if (minutes || parts.length === 0) parts.push(`${minutes} min`);
  return parts.join(", ");
}

export default async function StatsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const watched = await readWatched(user.id);
  const movieMin = watched
    .filter((i) => i.media_type === "movie")
    .reduce((s, i) => s + (i.runtime || 0), 0);
  const tvMin = watched
    .filter((i) => i.media_type === "tv")
    .reduce((s, i) => s + (i.runtime || 0), 0);
  const movieCount = watched.filter((i) => i.media_type === "movie").length;
  const epCount = watched.filter((i) => i.media_type === "tv").length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Estatísticas</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg bg-zinc-900 p-6">
          <p className="text-zinc-400 text-sm">Tempo em filmes</p>
          <p className="text-2xl font-bold text-teal-500 mt-1">{format(movieMin)}</p>
          <p className="text-zinc-500 text-sm mt-1">{movieCount} filme(s) assistido(s)</p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-6">
          <p className="text-zinc-400 text-sm">Tempo em séries</p>
          <p className="text-2xl font-bold text-teal-500 mt-1">{format(tvMin)}</p>
          <p className="text-zinc-500 text-sm mt-1">{epCount} episódio(s) assistido(s)</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-zinc-900 p-6">
        <p className="text-zinc-400 text-sm">Total</p>
        <p className="text-2xl font-bold mt-1">{format(movieMin + tvMin)}</p>
      </div>
    </div>
  );
}
