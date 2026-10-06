const BASE = "https://api.themoviedb.org/3";

function key() {
  const k = process.env.TMDB_API_KEY;
  if (!k || k === "COLE_SUA_CHAVE_AQUI") {
    throw new Error("Defina TMDB_API_KEY em .env.local");
  }
  return k;
}

export async function tmdb(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", key());
  url.searchParams.set("language", "pt-BR");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export const img = (p: string | null, size = "w500") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : "https://placehold.co/500x750?text=Sem+imagem";
