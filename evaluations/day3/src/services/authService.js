const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");
const config = require("../config/env");

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user.id
    },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn }
  );
}

function getRefreshTokenExpiryDate() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

async function createTokensForUser(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiryDate()
    }
  });

  return { accessToken, refreshToken };
}

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

  const { accessToken, refreshToken } = await createTokensForUser(user);

  return {
    user: {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
  };
}

async function login(data) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error("Identifiants invalides");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Identifiants invalides");
    error.status = 401;
    throw error;
  }

  const { accessToken, refreshToken } = await createTokensForUser(user);

  return {
    user: {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
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

async function refresh(refreshToken) {
  if (!refreshToken) {
    const error = new Error("Refresh token manquant");
    error.status = 401;
    throw error;
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true }
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    const error = new Error("Refresh token invalide ou expiré");
    error.status = 401;
    throw error;
  }

  try {
    jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch (err) {
    const error = new Error("Refresh token invalide ou expiré");
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken(storedToken.user);

  return {
    accessToken,
    user: {
      id: storedToken.user.id,
      nom: storedToken.user.nom,
      email: storedToken.user.email,
      role: storedToken.user.role,
      createdAt: storedToken.user.createdAt
    }
  };
}

async function logout(refreshToken) {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });
  }

  return { message: "Déconnecté" };
}

module.exports = {
  register,
  login,
  me,
  refresh,
  logout
};
