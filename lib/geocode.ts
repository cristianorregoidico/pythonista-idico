export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
  country?: string;
}

export async function geocodeCity(city: string, country?: string): Promise<GeocodeResult | null> {
  const q = [city, country].filter(Boolean).join(", ");
  if (!q) {
    return null;
  }

  const endpoint = new URL("https://nominatim.openstreetmap.org/search");
  endpoint.searchParams.set("q", q);
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("limit", "1");
  endpoint.searchParams.set("addressdetails", "1");

  const response = await fetch(endpoint.toString(), {
    headers: {
      "User-Agent": process.env.GEOCODER_USER_AGENT || "pytonista-mvp/1.0",
      "Accept-Language": "en",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
    address?: {
      country?: string;
    };
  }>;

  if (!payload.length) {
    return null;
  }

  const first = payload[0];
  return {
    latitude: Number(first.lat),
    longitude: Number(first.lon),
    displayName: first.display_name,
    country: first.address?.country,
  };
}
