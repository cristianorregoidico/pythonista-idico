import "dotenv/config";
import bcrypt from "bcryptjs";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const sampleUsers = [
  {
    name: "Ana Pereira",
    city: "Lisbon",
    country: "Portugal",
    latitude: 38.7223,
    longitude: -9.1393,
    pythonVersion: "Python 3.8",
    pythonTechnologies: ["Django", "Pandas", "NumPy"],
    email: "ana@example.com",
    links: [
      { label: "GitHub", url: "https://github.com/ana" },
      { label: "LinkedIn", url: "https://linkedin.com/in/ana" },
    ],
  },
  {
    name: "Victor Gomez",
    city: "Bogota",
    country: "Colombia",
    latitude: 4.711,
    longitude: -74.0721,
    pythonVersion: "Python 3.10",
    pythonTechnologies: ["FastAPI", "SQLAlchemy", "Pydantic"],
    email: "victor@example.com",
    links: [
      { label: "X", url: "https://x.com/victor" },
      { label: "Website", url: "https://victor.dev" },
    ],
  },
  {
    name: "Emily Chen",
    city: "Toronto",
    country: "Canada",
    latitude: 43.6532,
    longitude: -79.3832,
    pythonVersion: "Python 3.11",
    pythonTechnologies: ["Scikit-Learn", "PyTorch", "Pandas"],
    email: "emily@example.com",
    links: [{ label: "Email", url: "emily@example.com" }],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  for (const user of sampleUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        city: user.city,
        country: user.country,
        latitude: user.latitude,
        longitude: user.longitude,
        pythonVersion: user.pythonVersion,
        pythonTechnologies: JSON.stringify(user.pythonTechnologies),
        email: user.email,
        passwordHash,
        contactLinks: {
          create: user.links,
        },
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
