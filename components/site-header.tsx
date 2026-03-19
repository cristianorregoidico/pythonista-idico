import Link from "next/link";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-semibold text-white">
          Pytonista
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/map" className="text-sm text-slate-200 transition hover:text-white">
            Map
          </Link>
          {session ? (
            <LogoutButton />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
              >
                Join now
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
