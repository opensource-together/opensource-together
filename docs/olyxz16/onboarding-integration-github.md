# Document d'Intégration : Serveur NestJS pour OpenSource Together

Ce document fournit un aperçu technique de l'application serveur NestJS située dans `apps/server`, et se concentre sur l'intégration de Github.

## 1. Aperçu du Projet

Le serveur est une application NestJS responsable de la logique backend de la plateforme OpenSource Together.

**Technologies Clés :**

*   **Framework :** [NestJS](https://nestjs.com/) (v11)
*   **ORM :** [Prisma](https://www.prisma.io/) (v6) pour l'interaction avec la base de données PostgreSQL.
*   **Authentification :** [SuperTokens](https://supertokens.com/) pour la gestion des sessions et OAuth (y compris GitHub).
*   **API :** API RESTful avec documentation Swagger.
*   **Architecture :** Le projet suit les principes de l'Architecture Propre (Clean Architecture), séparant les responsabilités en couches distinctes (Domaine, Application, Infrastructure, Interface). Il utilise également fortement le pattern **CQRS (Command Query Responsibility Segregation)**.

## 2. Architecture Principale

La base de code est structurée en "contextes", où chaque contexte représente un domaine métier spécifique (par exemple, `user`, `project`, `github`). Au sein de chaque contexte, vous trouverez généralement :

*   **Domaine :** Contient la logique métier principale et les entités. Ce sont des classes TypeScript pures sans dépendances de framework.
*   **Cas d'Utilisation (Couche Application) :**
    *   `commands/` : Encapsulent les actions qui modifient l'état du système (ex: `CreateUserCommand`).
    *   `queries/` : Encapsulent les demandes de données qui ne modifient pas l'état (ex: `FindUserByIdQuery`).
*   **Infrastructure :** Contient les détails d'implémentation pour les ports définis dans la couche application. Cela inclut les Repos (`PrismaProjectRepository`), les services d'API externes, etc.
*   **Contrôleurs (Couche Interface) :** Exposent les cas d'utilisation via des points de terminaison d'API. Ils sont maintenus légers et délèguent principalement le travail au `CommandBus` et au `QueryBus`.

## 3. Intégration GitHub (`/src/contexts/github`)

C'est le cœur de votre travail. L'intégration GitHub est responsable de toutes les interactions avec l'API GitHub, y compris l'authentification, la récupération de données et la gestion des repos.

### 3.1. Flux d'Authentification

L'authentification GitHub est gérée par la recette `ThirdParty` de SuperTokens. Le flux est le suivant :

1.  **Initiation :** Le frontend appelle une route gérée par SuperTokens (ex: `/auth/authorize/github`), qui redirige l'utilisateur vers GitHub pour l'autorisation OAuth. Les scopes requis (`read:user`, `repo`, etc.) sont définis dans `github-provider.config.ts`.
2.  **Callback :** GitHub redirige vers le backend.
3.  **Surcharge de `signInUp` :** La logique principale réside dans la surcharge de la fonction `signInUp` dans `apps/server/src/auth/recipes/third-party.recipe.ts`. Cette fonction est le point d'ancrage dans le flux SuperTokens.
4.  **Création de l'Utilisateur :**
    *   S'il s'agit d'un nouvel utilisateur, une entité `User` correspondante est créée dans notre base de données locale (`CreateUserCommand`).
    *   L'`access_token` de GitHub est récupéré de la réponse OAuth.
5.  **Stockage du Jeton (Token) :**
    *   L'`access_token` est **chiffré** à l'aide du `EncryptionService` (qui utilise `aes-256-gcm`).
    *   Le token chiffré et l'ID utilisateur GitHub sont stockés dans la table `UserGitHubCredentials` à l'aide de `CreateUserGhTokenCommand` ou `UpdateUserGhTokenCommand`.

### 3.2. Composants Clés

*   **Modèle `UserGitHubCredentials` (Prisma) :** Défini dans `schema.prisma`, cette table lie notre `userId` interne à un token d'accès GitHub chiffré et à l'ID GitHub de l'utilisateur. C'est la pierre angulaire pour effectuer des appels d'API authentifiés au nom de l'utilisateur.

*   **`EncryptionService` (`/src/contexts/encryption`) :** Un service crucial qui utilise une clé symétrique (`ENCRYPTION_KEY` du `.env`) pour chiffrer et déchiffrer les tokens d'accès GitHub avant leur persistance. **Cela garantit que nous ne stockons jamais de tokens en clair dans la base de données.**

*   **`GithubAuthGuard` (`/src/contexts/github/infrastructure/guards/github-auth.guard.ts`) :** C'est l'élément le plus important pour effectuer des requêtes authentifiées.
    *   C'est un Garde NestJS qui intercepte les requêtes entrantes vers les routes protégées.
    *   Il récupère le `userId` de la session SuperTokens.
    *   Il récupère le token GitHub chiffré de la base de données via `UserGitHubCredentialsRepositoryPort`.
    *   Il utilise l'`EncryptionService` pour déchiffrer le token.
    *   Il initialise une instance d'**`Octokit`** avec le token déchiffré.
    *   Enfin, il attache l'instance `octokit` authentifiée à l'objet de la requête, la rendant disponible dans le contrôleur.

*   **`GithubRepository` (`/src/contexts/github/infrastructure/repositories/github.repository.ts`) :** Cette classe agit comme un adaptateur pour l'API GitHub.
    *   Elle implémente le `GithubRepositoryPort`.
    *   Ses méthodes reçoivent l'instance `octokit` authentifiée (préparée par le `GithubAuthGuard`) en argument.
    *   Elle utilise l'instance `octokit` pour effectuer des appels d'API (ex: `octokit.rest.repos.get`, `octokit.graphql(...)`).
    *   Elle contient des adaptateurs (`toGithubRepoListInput`, etc.) pour mapper les réponses brutes de l'API GitHub à nos DTOs ou modèles de domaine.

### 3.3. Cas d'Utilisation Clés & Flux de Données

*   **Récupération des Repos Utilisateur (`/github/repos`) :**
    1.  `GithubController.getMyRepositories` est appelée.
    2.  `GithubAuthGuard` s'exécute, déchiffre le token et injecte une instance `octokit` authentifiée.
    3.  Le contrôleur appelle `githubRepository.findRepositoriesOfAuthenticatedUser(octokit)`.
    4.  `GithubRepository` utilise l'instance `octokit` pour appeler l'API GraphQL de GitHub.
    5.  Le résultat est mappé et retourné au client.

*   **Stockage/Mise à Jour des Jetons :**
    *   `CreateUserGhTokenCommand` : Appelé lors de l'inscription initiale pour chiffrer et stocker le token.
    *   `UpdateUserGhTokenCommand` : Appelé lors des connexions ultérieures pour mettre à jour le token, garantissant que nous avons toujours le plus récent.

*   **Calcul des Statistiques (`GitHubStatsService`) :**
    *   Ce service utilise le `GithubRepository` pour récupérer diverses données (stars, commits, graphe de contribution) via l'API GraphQL pour calculer les statistiques de l'utilisateur.

## 4. Démarrage

Pour lancer le serveur en développement :

1.  Assurez-vous que Docker est en cours d'exécution.
2.  Configurez vos fichiers `.env` dans `apps/` et `apps/server/` en copiant les fichiers `.env.example`. Vous devrez créer une application OAuth GitHub pour obtenir un `GITHUB_CLIENT_ID` et un `GITHUB_CLIENT_SECRET`.
3.  Exécutez `docker-compose -f apps/docker-compose.dev.yml up` pour démarrer la base de données et SuperTokens.
4.  Naviguez vers `apps/server` et exécutez `pnpm install`.
5.  Exécutez `pnpm prisma:migrate:dev` pour appliquer les migrations de la base de données.
6.  Exécutez `pnpm start:dev` pour démarrer le serveur NestJS.

L'API sera disponible à `http://localhost:4000`, avec la documentation Swagger à `http://localhost:4000/v1/api-docs`.
