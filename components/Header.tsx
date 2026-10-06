import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export default async function Header() {
  const user = await getSessionUser().catch(() => null);
  return (
    <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-teal-500">
          tv<span className="text-zinc-400">time</span>
        </Link>
        <nav className="flex gap-4 text-sm text-zinc-300">
          <Link href="/">Início</Link>
          {user ? (
            <>
              <Link href="/search">Buscar</Link>
              <Link href="/watchlist">Watchlist</Link>
              <Link href="/stats">Estatísticas</Link>
              <span className="text-zinc-500">{user.name}</span>
              <a href="/api/auth/logout" className="text-red-400 hover:text-red-300">
                Sair
              </a>
            </>
          ) : (
            <>
              <Link href="/login">Entrar</Link>
              <Link href="/register" className="text-teal-500">Cadastre-se</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
