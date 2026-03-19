import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePythonTechnologies } from "@/lib/python-technologies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const pythonVersion = searchParams.get("pythonVersion")?.trim();

  const users = await prisma.user.findMany({
    where: {
      city: city
        ? {
            contains: city,
          }
        : undefined,
      pythonVersion: pythonVersion || undefined,
    },
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

  return NextResponse.json({
    users: users.map((user) => ({
      ...user,
      pythonTechnologies: parsePythonTechnologies(user.pythonTechnologies),
    })),
  });
}
