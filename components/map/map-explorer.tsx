"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CONTACT_ICON_URLS, getContactKind, toContactHref } from "@/lib/contact-links";
import { PYTHON_VERSIONS } from "@/lib/constants";
import type { PublicUser } from "@/types";

const UserMap = dynamic(() => import("@/components/map/user-map").then((mod) => mod.UserMap), {
  ssr: false,
});

export function MapExplorer({
  users,
  showDirectory = true,
}: {
  users: PublicUser[];
  showDirectory?: boolean;
}) {
  const [cityFilter, setCityFilter] = useState("");
  const [versionFilter, setVersionFilter] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const byCity = cityFilter
        ? user.city.toLowerCase().includes(cityFilter.toLowerCase().trim())
        : true;
      const byVersion = versionFilter ? user.pythonVersion === versionFilter : true;
      return byCity && byVersion;
    });
  }, [users, cityFilter, versionFilter]);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_240px_auto]">
          <input
            placeholder="Filter by city"
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
          />
          <select
            value={versionFilter}
            onChange={(event) => setVersionFilter(event.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
          >
            <option value="">All Python versions</option>
            {PYTHON_VERSIONS.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setCityFilter("");
              setVersionFilter("");
            }}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100"
          >
            Clear
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-300">Showing {filteredUsers.length} developers</p>
      </section>

      {filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-6 text-sm text-slate-300">
          No users match the current filters.
        </div>
      ) : (
        <UserMap users={filteredUsers} />
      )}

      {showDirectory && (
        <section className="grid gap-3 md:grid-cols-2">
          {filteredUsers.map((user) => (
            <article key={user.id} className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
              <div className="flex items-center gap-3">
                <Image
                  src={user.profileImageUrl || "/globe.svg"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full border border-slate-700 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <p className="text-sm text-slate-300">
                    {user.city}
                    {user.country ? `, ${user.country}` : ""}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-emerald-200">{user.pythonVersion}</p>
              {user.pythonTechnologies.length > 0 && (
                <p className="mt-1 text-xs text-slate-300">{user.pythonTechnologies.join(" · ")}</p>
              )}
              {user.contactLinks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.contactLinks.map((link, index) => {
                    const kind = getContactKind(link.url);
                    const href = toContactHref(link.url);

                    return (
                      <a
                        key={link.id || `${user.id}-${link.url}-${index}`}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open contact: ${link.url}`}
                        title={link.url}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-950 text-slate-200 transition hover:border-emerald-300"
                      >
                        {kind === "web" ? (
                          <WebIcon className="h-4 w-4" />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="h-4 w-4 bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${CONTACT_ICON_URLS[kind]})` }}
                          />
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

function WebIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 3C11.9 5 12.8 7.2 12.8 10C12.8 12.8 11.9 15 10 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 3C8.1 5 7.2 7.2 7.2 10C7.2 12.8 8.1 15 10 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
