const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");
const config = require("../config/env");

async function register(data) {
  const { nom, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error("Cet email est déjà utilisé");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      nom,
      email,
      password: hashedPassword
    }
  });

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    user: {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    token
  };
}

async function login(data) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error("Email ou mot de passe incorrect");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Email ou mot de passe incorrect");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    user: {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    token
  };
}

async function me(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) {
    const error = new Error("Utilisateur introuvable");
    error.status = 404;
    throw error;
  }

  return user;
}

module.exports = {
  register,
  login,
  me
};
