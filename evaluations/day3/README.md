# Evaluation Jour 3 — LibraryAPI

API de bibliothèque sécurisée réalisée avec Express, Prisma, SQLite, JWT, refresh tokens, Helmet, CORS, rate limiting, Morgan et Swagger.

## Lancer le projet

- npm install
- npx prisma migrate dev --name add_refresh_token
- npx prisma generate
- npm run dev

## Variables d'environnement

Le projet utilise :
- PORT
- NODE_ENV
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- JWT_EXPIRES_IN
- JWT_REFRESH_EXPIRES_IN
- ALLOWED_ORIGINS

Un fichier .env.example est fourni avec des valeurs de démonstration.

## Endpoints

### Authentification

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me

### Livres

- GET /api/livres
- GET /api/livres/:id
- POST /api/livres
- PUT /api/livres/:id
- DELETE /api/livres/:id

## Sécurité ajoutée au Jour 3

- refresh tokens stockés en base avec Prisma
- cookie refreshToken en HttpOnly
- helmet pour les headers HTTP de sécurité
- CORS permissif en développement et strict en production
- rate limiting global
- rate limiting renforcé sur /api/auth/login et /api/auth/register
- limitation de la taille des payloads avec express.json({ limit: "10kb" })
- gestion sécurisée des erreurs avec notFound + errorHandler
- logging HTTP avec morgan
- documentation OpenAPI avec Swagger

## Documentation Swagger

Interface disponible sur :

- /api-docs

## Architecture

Le projet respecte une architecture en couches :

- routes
- controllers
- services
- middlewares
- validators
- config
- db
- docs

## Choix techniques

- Express pour l'API HTTP
- Prisma + SQLite pour la base de données
- bcryptjs pour le hash des mots de passe
- jsonwebtoken pour les access tokens et refresh tokens
- helmet, cors, express-rate-limit et morgan pour la sécurité et l'observabilité
- swagger-jsdoc et swagger-ui-express pour la documentation

## Remarques

- .env n'est pas commité
- prisma/dev.db n'est pas commité
- node_modules n'est pas commité
- les migrations Prisma sont commitées
- .env.example est commité
