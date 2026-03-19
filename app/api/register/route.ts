import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializePythonTechnologies } from "@/lib/python-technologies";
import { registrationSchema } from "@/lib/validators";
import { getSessionCookieOptions, SESSION_COOKIE_NAME, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      city: input.city,
      country: input.country || null,
      latitude: input.latitude,
      longitude: input.longitude,
      pythonVersion: input.pythonVersion,
      pythonTechnologies: serializePythonTechnologies(input.pythonTechnologies),
      profileImageUrl: input.profileImageUrl || null,
      email: input.email,
      passwordHash,
      contactLinks: {
        create: input.contactLinks.map((link) => ({
          label: link.label,
          url: link.url,
        })),
      },
    },
  });

  const token = await signSession({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  const response = NextResponse.json({ ok: true, userId: user.id });
  response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
  return response;
}
