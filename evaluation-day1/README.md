# Evaluation Jour 1 — LibraryAPI

API de gestion de livres en Node.js natif avec le module http.

## Lancer le projet

- npm install
- npm start

Mode développement :
- npm run dev

## Routes

- GET /books
- GET /books/:id
- POST /books
- DELETE /books/:id
- GET /books?available=true

## Choix techniques

- serveur HTTP natif avec http
- routing dans modules/router.js
- persistance JSON dans db.json
- lecture/écriture dans modules/db.js
