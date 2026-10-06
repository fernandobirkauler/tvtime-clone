import Link from "next/link";

export default function Pager({
  page,
  totalPages,
  base,
  q,
}: {
  page: number;
  totalPages: number;
  base: string;
  q?: string;
}) {
  const link = (p: number) => `${base}?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  // Janela de páginas numeradas ao redor da página atual
  const range = 2;
  const pages: (number | "...")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= range) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={link(page - 1)} className="rounded-lg bg-zinc-900 px-4 py-2 hover:bg-zinc-800">
          ← Anterior
        </Link>
      )}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-zinc-500">…</span>
        ) : (
          <Link
            key={p}
            href={link(p)}
            className={`rounded-lg px-4 py-2 ${
              p === page
                ? "bg-teal-600 font-bold text-white"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            {p}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link href={link(page + 1)} className="rounded-lg bg-zinc-900 px-4 py-2 hover:bg-zinc-800">
          Próxima →
        </Link>
      )}
    </div>
  );
}
