"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "Login failed");
        return;
      }

      router.push("/map");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-[#3776ab]/40 bg-slate-900/85 p-6 shadow-xl shadow-[#3776ab]/10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl text-center">
          <span className="text-[#3776ab]">Py</span>
          <span className="text-[#f7df5f]">tonista</span>
        </h1>
        <h2 className="mt-3 text-xl sm:text-2xl font-bold text-slate-300 text-center">Log In</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-200">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#3776ab]/45 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-400 focus:border-[#3776ab] focus:outline-none focus:ring-2 focus:ring-[#3776ab]/35"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-200">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-[#3776ab]/45 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-400 focus:border-[#3776ab] focus:outline-none focus:ring-2 focus:ring-[#3776ab]/35"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#f7df5f] px-4 py-2 font-semibold text-slate-900 transition hover:bg-[#f3d74a] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-300">
          Need an account?{" "}
          <Link href="/register" className="font-semibold text-[#3776ab] hover:text-[#4a8cc2]">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
