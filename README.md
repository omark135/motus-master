# Motus Master

## Description du projet

Motus Master est une application web inspirée du jeu Motus.  
Le principe est simple : le joueur doit trouver un mot secret en 6 tentatives maximum.

À chaque proposition, le jeu donne des indices visuels pour aider le joueur :

- une lettre bien placée est affichée en rouge ;
- une lettre présente dans le mot mais mal placée est affichée en jaune ;
- une lettre absente du mot est affichée en bleu.

La première lettre du mot secret est affichée dès le début de la partie.

Le projet contient une partie front-end, une partie back-end, un système d’authentification, une base de données SQLite, un classement des joueurs et une documentation Swagger.

---

## Technologies utilisées

### Front-end

- React
- Vite
- CSS

### Back-end

- Node.js
- Express.js
- SQLite
- JWT pour l’authentification
- bcrypt pour le hashage des mots de passe
- Swagger pour la documentation de l’API

---

## Fonctionnalités principales

- Création de compte utilisateur
- Connexion utilisateur
- Protection du jeu : il faut être connecté pour jouer
- Génération d’un mot à deviner
- Plusieurs niveaux de difficulté selon la longueur du mot
- Grille de jeu avec 6 essais
- Affichage des indices après chaque tentative
- Gestion de la victoire
- Gestion de la défaite
- Calcul du score
- Classement des meilleurs joueurs
- Documentation API avec Swagger
- Base de données initialisée automatiquement

---

## Règles du jeu

Le joueur doit deviner un mot secret.

Il dispose de 6 essais maximum.

La première lettre du mot est donnée automatiquement.

Après chaque essai :

- rouge : la lettre est correcte et bien placée ;
- jaune : la lettre existe dans le mot mais elle est mal placée ;
- bleu : la lettre n’existe pas dans le mot.

Si le joueur trouve le mot avant la fin des 6 essais, il gagne la partie et un score est ajouté au classement.

Si le joueur utilise les 6 essais sans trouver le mot, la partie est perdue.

---

## Structure du projet

```text
motus-master-ready/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── docs/
│   └── modifications_bdd.md
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md