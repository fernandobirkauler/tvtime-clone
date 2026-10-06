"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError((await res.json()).error ?? "Erro ao cadastrar");
    }
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-bold mb-6">Cadastre-se</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          required
          className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-teal-500"
        />
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
          minLength={4}
          required
          className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-teal-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          disabled={loading}
          className="rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-zinc-400">
        Já tem conta? <Link href="/login" className="text-teal-500">Entrar</Link>
      </p>
    </div>
  );
}
