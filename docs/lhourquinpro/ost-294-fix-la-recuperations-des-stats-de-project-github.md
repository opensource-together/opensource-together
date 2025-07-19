# OST-294 : Correction de la récupération des stats de projet GitHub et changement de structure pour la persistence.

## Résumé des actions réalisées

- Correction de la logique de récupération des statistiques GitHub pour les projets pour les endpoints `GET projects/`, `GET projects/:porjectId`.
- Ajout ou correction des repositories et services pour fiabiliser la récupération des données (issues, stars, forks, etc.).
- Gestion des erreurs et des cas limites (projets sans repo, API rate limit, etc.).
- Documentation du fonctionnement et des endpoints concernés dans swagger.
- Refactoring avec création du dossier `persistence` avec le module `persistence.infrastructure.ts` pour éviter les instanciations multiple de `PrismaService`.

## Changements structurels majeurs

- Suppression des dossiers obsolètes `/application` pour aligner le projet sur la nouvelles architecture par contextes.
- Centralisation de la logique GitHub dans `src/contexts/github/` avec séparation stricte entre infrastructure, use-cases, ports et repositories.
- Création du dossier `persistence` avec le module `persistence.infrastructure.ts`, les `Dockerfile` et `docker-compose` ont était modifier en conséquence. 
- Ajout de la nouvelle variable d'environnement `GH_TOKEN_OST_PUBLIC` permettant la récupération des stats d'un repository github sans connexion nécéssaire de l'utilisateur.

## Configuration requise

### 1. Création du token GitHub

1. Aller sur [GitHub.com](https://github.com) et se connecter
2. Cliquer sur l'avatar en haut à droite → **Settings**
3. Dans le menu de gauche, aller dans **Developer settings**
4. Cliquer sur **Personal access tokens** → **Tokens (classic)**
5. Cliquer sur **Generate new token (classic)**
6. Donner un nom descriptif (ex: "OpenSource Together API")
7. Sélectionner les scopes suivants :
   - `public_repo` (pour accéder aux repos publics)
8. Cliquer sur **Generate token**
9. **IMPORTANT** : Copier le token généré (il ne sera plus visible après)

### 2. Configuration des variables d'environnement

Dans tout les fichiers `.env` du projet:

```env
# GitHub API Configuration
GH_TOKEN_OST_PUBLIC=<token>
```

### 3. Vérification de la configuration

Après avoir configuré le token, redémarrer le serveur backend et vérifier dans les logs qu'il n'y a pas d'erreurs d'authentification GitHub.

## Utilisation

1. **Pré-requis** :  
   - Node version 22
   - Token GitHub configuré selon les étapes ci-dessus
   - Variables d'environnement correctement configurées
   - Lancer le backend (`apps/server`) avec `npm run start:dev` ou via Docker

2. **Endpoints concernés** :  
   - Les endpoints de récupération de projet incluent désormais les statistiques GitHub à jour sans être obligatoirement connecter grace aux token dédié a cela, voir le `.env.example`.
   - `GET projects` pour récupérer tout les projets et leurs statistique github, voir la doc swagger sur l'adresse du back avec l'endpoint `api-docs/#/Projects/ProjectController_getProjects`
   - `GET projects/:id` pour récupérer un projet et ses statistique github, voir la doc swagger sur l'adresse du back avec l'endpoint `api-docs/#/Projects/ProjectController_getProject`

3. **Comportement** :  
   - Lorsqu'un projet possède un repo GitHub associé, les stats sont récupérées dynamiquement via l'API GitHub
   - En cas d'erreur (repo inexistant, rate limit, donnée manquante car projet récemment créer), un fallback ou une gestion d'erreur appropriée est appliquée.
   - Si l'utilisateurs est connecter, c'est son `acces_token` github qui sera utilisé, si c'est un visiteur ( non connecté ) c'est notre token `GH_TOKEN_OST_PUBLIC` qui sera utilisé, cela permet de maximiser les chance de ne pas consommer la totatlité des requêtes permise sur l'api github (5000 par heure).

## Points d'attention

- Les tokens GitHub doivent être valides et avec les scopes nécessaires
- Surveiller les logs pour détecter d'éventuels problèmes de rate limit ou d'API GitHub
- Le token a une durée de vie limitée, penser à le renouveler si nécessaire ou a le configurer pour qu'il n'en ai pas.
- Ne jamais commiter le token dans le code source
