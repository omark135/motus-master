# Motus Master

Projet complet de jeu **Motus** avec authentification, niveaux de difficulté, score, classement, API REST, Swagger, Docker et base SQLite.

## Fonctionnalités

- Création de compte et connexion.
- JWT pour protéger les routes du jeu.
- Partie impossible sans connexion.
- 6 tentatives maximum.
- Première lettre du mot affichée.
- Niveaux de difficulté :
  - Facile : 5 lettres
  - Moyen : 7 lettres
  - Difficile : 9 lettres
- Grille Motus avec indices :
  - Rouge : lettre bien placée
  - Jaune : lettre présente mais mal placée
  - Bleu : lettre absente
- Vérification des mots proposés.
- Sauvegarde des scores.
- Classement des joueurs.
- Interface responsive.
- Documentation Swagger disponible sur `http://localhost:3000/swagger`.
- Projet dockerisé.
- Initialisation automatique de la base de données.

## Technologies utilisées

### Back-end

- Node.js
- Express
- SQLite
- JWT
- bcrypt
- Swagger UI

### Front-end

- React
- Vite
- CSS simple responsive

## Architecture

```text
motus-master/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js
│   │   │   └── schema.sql
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── game.routes.js
│   │   │   └── score.routes.js
│   │   ├── utils/
│   │   │   ├── motus.js
│   │   │   └── wordProvider.js
│   │   ├── swagger.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docs/
│   └── modifications_bdd.md
├── docker-compose.yml
├── .env.example
└── README.md
```

## Lancer le projet avec Docker

### 1. Copier les variables d'environnement

```bash
cp .env.example .env
```

### 2. Lancer le projet

```bash
docker compose up --build
```

### 3. Ouvrir le projet

- Front-end : `http://localhost:5173`
- Back-end : `http://localhost:3000`
- Swagger : `http://localhost:3000/swagger`

## Lancer le projet sans Docker

### Back-end

```bash
cd backend
npm install
cp ../.env.example ../.env
npm run dev
```

### Front-end

Dans un autre terminal :

```bash
cd frontend
npm install
npm run dev
```

## Compte de test

Tu peux créer un compte depuis l'interface.

Un compte de test est aussi disponible après l'initialisation :

```text
Pseudo : demo
Mot de passe : demo1234
```

## API principale

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |
| POST | `/api/game/start` | Commencer une partie |
| POST | `/api/game/guess` | Proposer un mot |
| GET | `/api/scores/leaderboard` | Voir le classement |
| GET | `/swagger` | Documentation Swagger |

## Règles du score

Le score est calculé ainsi :

```text
score = longueur du mot * 100 - nombre de tentatives * 10 + bonus difficulté
```

Bonus difficulté :

- Facile : 0
- Moyen : 50
- Difficile : 100

## Base de données

La base SQLite est créée automatiquement au lancement du back-end.

Tables principales :

- `users`
- `words`
- `games`
- `guesses`
- `scores`

Le détail des modifications par rapport au schéma fourni est dans :

```text
docs/modifications_bdd.md
```

## Mettre le projet sur GitHub

### 1. Créer un dépôt GitHub

Va sur GitHub, clique sur **New repository**, donne un nom au dépôt, par exemple :

```text
motus-master
```

Ne coche pas forcément README, car ce projet en contient déjà un.

### 2. Initialiser Git dans le dossier du projet

Dans le terminal, à la racine du projet :

```bash
git init
git add .
git commit -m "Initial commit - Motus Master"
```

### 3. Relier le dossier au dépôt GitHub

Remplace `TON-UTILISATEUR` par ton pseudo GitHub :

```bash
git branch -M main
git remote add origin https://github.com/TON-UTILISATEUR/motus-master.git
git push -u origin main
```

### 4. Vérifier le rendu

Sur GitHub, vérifie que les fichiers suivants sont bien visibles :

- `README.md`
- `.env.example`
- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docs/modifications_bdd.md`

## Commandes utiles

Arrêter Docker :

```bash
docker compose down
```

Supprimer aussi le volume SQLite :

```bash
docker compose down -v
```

Voir les logs du back-end :

```bash
docker compose logs -f backend
```
