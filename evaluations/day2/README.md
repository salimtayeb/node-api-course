# Evaluation Jour 2 — LibraryAPI

API de gestion de bibliothèque réalisée avec Express, Prisma, SQLite, JWT, bcrypt et Zod.

## Lancer le projet

- npm install
- npx prisma migrate dev --name init
- npx prisma generate
- npm run seed
- npm run dev

## Variables d'environnement

Le projet utilise un fichier .env local et un fichier .env.example commité.

Variables utilisées :
- PORT
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN

## Endpoints

### Authentification

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Livres

- GET /api/livres
- GET /api/livres/:id
- POST /api/livres
- PUT /api/livres/:id
- DELETE /api/livres/:id

### Emprunts

- POST /api/livres/:id/emprunter
- POST /api/livres/:id/retourner

## Choix techniques

- Express pour l'API HTTP
- Prisma + SQLite pour la base de données
- JWT pour l'authentification
- bcryptjs pour le hash des mots de passe
- Zod pour la validation des données
- Architecture en couches :
  - routes
  - controllers
  - services

## Règles d'accès

- les routes de lecture des livres sont publiques
- POST /api/livres et PUT /api/livres/:id nécessitent un utilisateur connecté
- DELETE /api/livres/:id nécessite un admin
- les routes d'emprunt et de retour nécessitent un utilisateur connecté

## Seed

Le projet contient un seed Prisma qui crée :
- un compte admin
- des livres initiaux

Compte admin par défaut :
- email : admin@library.local
- mot de passe : Admin1234

## Structure du projet

evaluations/day2/
- prisma/
- src/config
- src/db
- src/middlewares
- src/services
- src/controllers
- src/routes
- src/validators

