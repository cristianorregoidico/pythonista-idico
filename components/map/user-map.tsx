"use client";

import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import L from "leaflet";
import Image from "next/image";
import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CONTACT_ICON_URLS, getContactKind, toContactHref } from "@/lib/contact-links";
import type { PublicUser } from "@/types";
import { LinkedInIcon } from "../icons/LinkedInIcon";

const CONTACT_KIND_LABEL: Record<string, string> = {
  gmail: "Gmail",
  x: "X",
  instagram: "Instagram",
  github: "GitHub",
  gitlab: "GitLab",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  discord: "Discord",
  telegram: "Telegram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  web: "Website",
};

const PYTHON_LOGO_URL = "https://cdn.simpleicons.org/python/FFD43B";

type UserMapProps = {
  users: PublicUser[];
  className?: string;
  showStats?: boolean;
};

const pythonMarkerIcon = L.divIcon({
  className: "python-marker-wrap",
  html: '<span class="python-marker"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function createClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count < 10 ? "sm" : count < 100 ? "md" : "lg";
  const px = size === "sm" ? 34 : size === "md" ? 42 : 52;

  return L.divIcon({
    html: `<span class="python-cluster python-cluster-${size}">${count}</span>`,
    className: "python-cluster-wrap",
    iconSize: [px, px],
    iconAnchor: [px / 2, px / 2],
  });
}

export function UserMap({
  users,
  className = "h-[70vh] min-h-130 w-full rounded-xl border border-slate-700",
  showStats = true,
}: UserMapProps) {
  const totalSpots = useMemo(() => {
    const locations = new Set(users.map((user) => `${user.latitude}:${user.longitude}`));
    return locations.size;
  }, [users]);

  return (
    <div className={showStats ? "space-y-3" : "h-full w-full"}>
      {showStats && (
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {users.length} developers in {totalSpots} locations
        </p>
      )}
      <MapContainer
        center={[18, 8]}
        zoom={2}
        minZoom={2}
        zoomControl={false}
        className={className}
        scrollWheelZoom
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={55}
          spiderfyOnMaxZoom
          spiderfyDistanceMultiplier={1.35}
          zoomToBoundsOnClick
          iconCreateFunction={createClusterIcon}
          spiderLegPolylineOptions={{ color: "#f7df5f", weight: 1.6, opacity: 0.95 }}
        >
          {users.map((user) => (
            <Marker key={user.id} position={[user.latitude, user.longitude]} icon={pythonMarkerIcon}>
              <Popup>
                <div className="min-w-60 rounded-2xl border border-slate-700/70 bg-slate-900/95 p-4 text-slate-100 shadow-xl shadow-black/40">
                  <div className="mb-0 flex flex-col items-center text-center">
                    <Image
                      src={user.profileImageUrl || "/globe.svg"}
                      alt={user.name}
                      width={84}
                      height={84}
                      className="h-20 w-20 rounded-full border-2 border-[#3776ab] object-cover shadow-lg shadow-[#3776ab]/30"
                    />
                    <p className="m-0 text-2xl font-semibold text-white" >{user.name}</p>
                    <p className="text-sm text-slate-300">
                      {user.city}
                      {user.country ? `, ${user.country}` : ""}
                    </p>
                  </div>

                  <div className="mb-3 flex flex-col items-center">
                    <p className="mb-1 text-[11px] font-semibold  tracking-wide text-slate-400">Pytonista Since:</p>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#3776ab]/60 bg-[#3776ab]/15 px-3 py-1 text-xs font-medium text-[#9dc8f0]">
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${PYTHON_LOGO_URL})` }}
                      />
                      {user.pythonVersion}
                    </span>
                  </div>

                  {user.pythonTechnologies.length > 0 && (
                    <div className="mb-3 flex flex-wrap justify-center gap-2">
                      {user.pythonTechnologies.slice(0, 3).map((technology) => (
                        <span
                          key={`${user.id}-${technology}`}
                          className="rounded-md border border-slate-600/70 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 border-t border-slate-700/70 pt-3">
                    {user.contactLinks.length === 0 ? (
                      <p className="text-xs text-slate-400">No public links</p>
                    ) : (
                      user.contactLinks.map((link, index) => {
                        const kind = getContactKind(link.url);
                        const href = toContactHref(link.url);
                        const iconLabel = CONTACT_KIND_LABEL[kind] || "Website";

                        return (
                        <a
                          key={link.id || `${user.id}-${link.url}-${index}`}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${iconLabel}: ${link.url}`}
                          title={link.url}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-100 transition hover:border-[#3776ab] hover:bg-slate-700"
                        >
                          {kind === "web" ? (
                            <WebIcon className="h-4 w-4" />
                          ) : kind === "linkedin" ? (
                            <LinkedInIcon className="h-4 w-4" />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="h-4 w-4 bg-contain bg-center bg-no-repeat"
                              style={{ backgroundImage: `url(${CONTACT_ICON_URLS[kind]})` }}
                            />
                          )}
                        </a>
                        );
                      })
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
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
