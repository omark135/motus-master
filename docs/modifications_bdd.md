# Documentation des modifications de la base de données

Le schéma fourni dans le sujet contient trois entités principales :

- `Users`
- `Wall of Fame`
- `Mots`

Pour rendre le projet plus complet, sécurisé et cohérent, le schéma a été amélioré.

## Schéma fourni

### Users

Champs fournis :

- `id`
- `pseudo`
- `password`
- `numero_secu`

### Wall of Fame

Champs fournis :

- `id`
- `Scores`
- `login`

### Mots

Champs fournis :

- `id`
- `word`
- `longueur`
- `difficulté`

## Problèmes du schéma initial

1. Le champ `numero_secu` est inutile pour un jeu et représente une donnée sensible.
2. Le champ `login` dans `Wall of Fame` devrait être relié à un utilisateur.
3. Le mot de passe doit être stocké sous forme hashée.
4. Il manque une table pour sauvegarder les parties.
5. Il manque une table pour sauvegarder les tentatives.
6. Les relations entre les tables ne sont pas explicites.

## Modifications effectuées

### Table `users`

Remplace la table `Users`.

Champs :

- `id`
- `pseudo`
- `password_hash`
- `created_at`

Modifications :

- Suppression de `numero_secu`.
- Remplacement de `password` par `password_hash`.
- Ajout d'une contrainte `UNIQUE` sur `pseudo`.

### Table `words`

Remplace la table `Mots`.

Champs :

- `id`
- `word`
- `length`
- `difficulty`
- `created_at`

Modifications :

- Les noms de champs ont été uniformisés en anglais pour le code.
- Ajout de `created_at`.
- Ajout d'une contrainte d'unicité sur `word`.

### Table `games`

Nouvelle table.

Champs :

- `id`
- `user_id`
- `word_id`
- `difficulty`
- `status`
- `attempts_used`
- `started_at`
- `finished_at`

Rôle :

- Sauvegarder chaque partie.
- Savoir si une partie est en cours, gagnée ou perdue.

### Table `guesses`

Nouvelle table.

Champs :

- `id`
- `game_id`
- `guess`
- `result_json`
- `attempt_number`
- `created_at`

Rôle :

- Sauvegarder chaque proposition du joueur.
- Sauvegarder les indices retournés au joueur.

### Table `scores`

Remplace `Wall of Fame`.

Champs :

- `id`
- `user_id`
- `game_id`
- `score`
- `created_at`

Modifications :

- `login` est remplacé par une relation avec `users`.
- Les scores sont reliés aux parties.
- Le classement peut être calculé proprement.

## Pourquoi ces modifications ?

Ces modifications permettent :

- une meilleure sécurité ;
- une base relationnelle plus propre ;
- une sauvegarde complète des parties ;
- un classement fiable ;
- une meilleure évolutivité du projet.
