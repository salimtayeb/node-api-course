require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@library.local" },
    update: {},
    create: {
      nom: "Admin",
      email: "admin@library.local",
      password: adminPassword,
      role: "admin"
    }
  });

  const livres = [
    {
      titre: "Clean Code",
      auteur: "Robert C. Martin",
      annee: 2008,
      genre: "Informatique",
      disponible: true
    },
    {
      titre: "The Pragmatic Programmer",
      auteur: "Hunt & Thomas",
      annee: 1999,
      genre: "Informatique",
      disponible: true
    },
    {
      titre: "Node.js Design Patterns",
      auteur: "Mario Casciaro",
      annee: 2020,
      genre: "Informatique",
      disponible: true
    }
  ];

  for (const livre of livres) {
    const existing = await prisma.livre.findFirst({
      where: {
        titre: livre.titre,
        auteur: livre.auteur
      }
    });

    if (!existing) {
      await prisma.livre.create({ data: livre });
    }
  }

  console.log("Seed terminé");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
