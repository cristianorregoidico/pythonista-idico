import { NextResponse } from "next/server";
import { geocodeCity } from "@/lib/geocode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const country = searchParams.get("country")?.trim() || undefined;

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  const result = await geocodeCity(city, country);
  if (!result) {
    return NextResponse.json({ error: "Could not resolve this location" }, { status: 404 });
  }

  return NextResponse.json(result);
}
