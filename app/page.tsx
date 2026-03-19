import { FullscreenCommunityMap } from "@/components/home/fullscreen-community-map";
import { parsePythonTechnologies } from "@/lib/python-technologies";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
      latitude: true,
      longitude: true,
      pythonVersion: true,
      pythonTechnologies: true,
      profileImageUrl: true,
      contactLinks: {
        select: {
          id: true,
          label: true,
          url: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="w-full">
      <FullscreenCommunityMap
        users={users.map((user) => ({
          ...user,
          pythonTechnologies: parsePythonTechnologies(user.pythonTechnologies),
        }))}
      />
      {/* <div className="fixed bottom-4 right-4 z-[980]">
        <Link
          href="/register"
          className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
        >
          Create profile
        </Link>
      </div> */}
    </main>
  );
}
