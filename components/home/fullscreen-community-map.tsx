"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicUser } from "@/types";

const UserMap = dynamic(() => import("@/components/map/user-map").then((mod) => mod.UserMap), {
  ssr: false,
});

export function FullscreenCommunityMap({ users }: { users: PublicUser[] }) {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(true);

  const countries = useMemo(() => {
    return Array.from(
      new Set(users.map((user) => user.country).filter((country): country is string => Boolean(country))),
    ).sort((a, b) => a.localeCompare(b));
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (selectedCountry === "all") return users;
    return users.filter((user) => user.country === selectedCountry);
  }, [users, selectedCountry]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <UserMap users={filteredUsers} className="h-full w-full border-0" showStats={false} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/20" />

      <aside
        className={`absolute left-0 top-0 z-[900] h-full w-[290px] border-r border-white/10 bg-black/90 p-4 text-slate-100 backdrop-blur-sm transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-[#f7df5f]">Pytonista</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A map-first community for Python developers to connect worldwide, discover peers,
              and share public profiles.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">How it works</p>
            <p>1) Create your profile with city and Python version.</p>
            <p>2) Add links so people can connect with you.</p>
            <p>3) Appear on the map and discover nearby developers.</p>
          </div>

          <div className="space-y-2">
            <Link
              href="/login"
              className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Join
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Feedback (GitHub)
            </a>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
            {users.length} Developers
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
            {countries.length} Countries
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setDrawerOpen((current) => !current)}
        className={`absolute top-4 z-[950] inline-flex items-center gap-2 rounded-lg border border-[#f7df5f]/70 bg-black/85 px-3 py-2 text-sm font-medium text-[#f7df5f] backdrop-blur transition-[left] duration-300 hover:bg-black ${
          drawerOpen ? "left-[304px]" : "left-4"
        }`}
      >
        <span aria-hidden="true" className="text-base leading-none">
          ≡
        </span>
        {drawerOpen ? "Hide" : "Menu"}
      </button>

      <div className="absolute right-4 top-4 z-[950] w-56 rounded-lg border border-[#3776ab]/60 bg-black/85 p-2 backdrop-blur">
        <label htmlFor="country-filter" className="mb-1 block text-xs uppercase tracking-wide text-[#9fb8d1]">
          Country
        </label>
        <select
          id="country-filter"
          value={selectedCountry}
          onChange={(event) => setSelectedCountry(event.target.value)}
          className="w-full rounded-md border border-[#3776ab]/60 bg-black px-3 py-2 text-sm text-[#f7df5f]"
        >
          <option value="all">All countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
