import { prisma } from "@/lib/prisma";
import { MapExplorer } from "@/components/map/map-explorer";
import { parsePythonTechnologies } from "@/lib/python-technologies";

export default async function MapPage() {
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
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Community map</h1>
      <p className="mt-1 text-slate-300">Public view for everyone. See where Python developers are building.</p>
      <div className="mt-5">
        <MapExplorer
          users={users.map((user) => ({
            ...user,
            pythonTechnologies: parsePythonTechnologies(user.pythonTechnologies),
          }))}
        />
      </div>
    </main>
  );
}
