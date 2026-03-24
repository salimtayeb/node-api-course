const prisma = require("../db/prisma");

async function findAll() {
  return prisma.livre.findMany({
    orderBy: { id: "asc" }
  });
}

async function findById(id) {
  const livre = await prisma.livre.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!livre) {
    const error = new Error("Livre introuvable");
    error.status = 404;
    throw error;
  }

  return livre;
}

async function create(data) {
  const { titre, auteur, annee, genre, disponible } = data;

  return prisma.livre.create({
    data: {
      titre,
      auteur,
      annee,
      genre,
      disponible: disponible ?? true
    }
  });
}

async function update(id, data) {
  await findById(id);

  const { titre, auteur, annee, genre, disponible } = data;

  return prisma.livre.update({
    where: { id: parseInt(id, 10) },
    data: {
      titre,
      auteur,
      annee,
      genre,
      disponible
    }
  });
}

async function remove(id) {
  await findById(id);

  await prisma.livre.delete({
    where: { id: parseInt(id, 10) }
  });

  return { message: "Livre supprimé" };
}

async function emprunter(livreId, userId) {
  const id = parseInt(livreId, 10);

  const livre = await prisma.livre.findUnique({
    where: { id }
  });

  if (!livre) {
    const error = new Error("Livre introuvable");
    error.status = 404;
    throw error;
  }

  if (!livre.disponible) {
    const error = new Error("Ce livre n'est pas disponible");
    error.status = 409;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    await tx.livre.update({
      where: { id },
      data: { disponible: false }
    });

    return tx.emprunt.create({
      data: {
        livreId: id,
        userId: parseInt(userId, 10)
      },
      include: {
        livre: true,
        user: {
          select: {
            id: true,
            nom: true,
            email: true,
            role: true
          }
        }
      }
    });
  });
}

async function retourner(livreId, userId) {
  const id = parseInt(livreId, 10);

  const livre = await prisma.livre.findUnique({
    where: { id }
  });

  if (!livre) {
    const error = new Error("Livre introuvable");
    error.status = 404;
    throw error;
  }

  const emprunt = await prisma.emprunt.findFirst({
    where: {
      livreId: id,
      userId: parseInt(userId, 10),
      dateRetour: null
    }
  });

  if (!emprunt) {
    const error = new Error("Aucun emprunt en cours pour ce livre");
    error.status = 404;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    await tx.livre.update({
      where: { id },
      data: { disponible: true }
    });

    return tx.emprunt.update({
      where: { id: emprunt.id },
      data: { dateRetour: new Date() },
      include: {
        livre: true,
        user: {
          select: {
            id: true,
            nom: true,
            email: true,
            role: true
          }
        }
      }
    });
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  emprunter,
  retourner
};
