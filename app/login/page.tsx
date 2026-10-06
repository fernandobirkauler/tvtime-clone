"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError((await res.json()).error ?? "Erro ao entrar");
    }
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-bold mb-6">Entrar</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-teal-500"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          type="password"
          required
          className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-teal-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          disabled={loading}
          className="rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-zinc-400">
        Não tem conta? <Link href="/register" className="text-teal-500">Cadastre-se</Link>
      </p>
    </div>
  );
}
