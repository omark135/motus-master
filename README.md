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
- Projet dockerisé

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

## Système de score et classement

À la fin d’une partie gagnée, un score est calculé selon la performance du joueur.

Le classement affiche le meilleur score obtenu par chaque joueur.

Cela signifie que si un joueur gagne plusieurs parties, le score affiché dans le classement ne correspond pas à la somme de toutes ses parties, mais à son meilleur résultat.

Exemple :

- partie 1 : 490 points ;
- partie 2 : 320 points ;
- partie 3 : 450 points.

Dans ce cas, le classement affichera :

```text
490 points
```

Ce choix permet de classer les joueurs selon leur meilleure performance.

Le classement est global. Il affiche les meilleurs scores de tous les joueurs, même avant de commencer une nouvelle partie.

Le score actuel du joueur connecté est affiché séparément dans l’interface du jeu.

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
```

---

## Lancement avec Docker

Le projet contient une configuration Docker avec :

```text
docker-compose.yml
backend/Dockerfile
frontend/Dockerfile
```

Pour lancer le projet avec Docker, il faut se placer à la racine du projet, puis exécuter :

```powershell
docker compose up --build
```

Une fois les conteneurs lancés, l’application est disponible ici :

```text
Front-end : http://localhost:5173
Back-end : http://localhost:3000
Swagger : http://localhost:3000/swagger
```

Cette méthode permet de lancer le front-end et le back-end dans un environnement standardisé.

En cas de problème local avec Docker, le projet peut aussi être lancé manuellement avec Node.js en lançant séparément le back-end et le front-end, comme expliqué dans les sections suivantes.

---

## Lancement manuel avec Node.js

Le projet peut être lancé manuellement avec Node.js.

Il faut utiliser deux terminaux :

- un terminal pour le back-end ;
- un terminal pour le front-end.

---

### 1. Lancer le back-end

Ouvrir un premier terminal PowerShell, puis se placer dans le dossier du back-end :

```powershell
cd "C:\Users\Omar\Downloads\motus-master-ready\motus-master-ready\backend"
```

Installer les dépendances :

```powershell
npm.cmd install
```

Lancer le serveur back-end :

```powershell
npm.cmd run dev
```

Si tout fonctionne, le terminal affiche :

```text
Backend lancé sur http://localhost:3000
Swagger disponible sur http://localhost:3000/swagger
```

Le back-end est disponible ici :

```text
http://localhost:3000
```

La documentation Swagger est disponible ici :

```text
http://localhost:3000/swagger
```

---

### 2. Lancer le front-end

Ouvrir un deuxième terminal PowerShell, puis se placer dans le dossier du front-end :

```powershell
cd "C:\Users\Omar\Downloads\motus-master-ready\motus-master-ready\frontend"
```

Installer les dépendances :

```powershell
npm.cmd install
```

Lancer le front-end :

```powershell
npm.cmd run dev
```

Si tout fonctionne, le terminal affiche une adresse locale comme :

```text
http://localhost:5173
```

L’application est ensuite accessible dans le navigateur à l’adresse :

```text
http://localhost:5173
```

---

## Compte de test

Un compte de test est disponible pour tester rapidement l’application :

```text
Pseudo : demo
Mot de passe : demo1234
```

Il est aussi possible de créer un nouveau compte directement depuis l’interface.

---

## Documentation Swagger

La documentation Swagger permet de consulter et tester les routes de l’API.

Elle est disponible une fois le back-end lancé :

```text
http://localhost:3000/swagger
```

Elle contient notamment les routes pour :

- créer un compte ;
- se connecter ;
- commencer une partie ;
- proposer un mot ;
- consulter le classement.

---

## Base de données

Le projet utilise SQLite.

La base de données est initialisée automatiquement au lancement du back-end.

Elle contient les informations nécessaires pour :

- les utilisateurs ;
- les mots du jeu ;
- les scores ;
- le classement des joueurs.

Les modifications apportées au schéma de base de données sont documentées dans le fichier :

```text
docs/modifications_bdd.md
```

---

## Sécurité

Le projet met en place plusieurs éléments de sécurité :

- les mots de passe ne sont pas stockés en clair ;
- les mots de passe sont hashés avec bcrypt ;
- l’authentification utilise un token JWT ;
- certaines routes du jeu sont protégées ;
- un utilisateur doit être connecté pour pouvoir jouer.

---

## Variables d’environnement

Le projet fournit un fichier :

```text
.env.example
```

Ce fichier contient les variables nécessaires pour configurer le projet.

Avant un lancement en local, il est possible de copier ce fichier en `.env`.

---

## API utilisée pour les mots

Le projet prévoit l’utilisation d’une source de mots pour générer les mots à deviner.

Les mots sont sélectionnés selon le niveau de difficulté, notamment en fonction de leur longueur.

Pour garantir un fonctionnement simple et stable lors de la correction, une liste de mots est également disponible dans la base de données locale.

Cela permet au jeu de fonctionner même si une API externe est temporairement indisponible.

---

## Auteur

Projet réalisé par Omar KOUTA dans le cadre du test technique Motus Master.