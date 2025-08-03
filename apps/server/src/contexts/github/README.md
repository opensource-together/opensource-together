# GitHub Context

Ce contexte gère toutes les interactions avec l'API GitHub, incluant la récupération des repositories utilisateur et d'organisations.

## Endpoints disponibles

### 1. Récupération des repositories utilisateur

- **Endpoint** : `GET /github/repos`
- **Description** : Récupère tous les repositories publics dont l'utilisateur authentifié est propriétaire
- **Authentification** : Requiert un token GitHub valide
- **Réponse** : Liste des repositories avec leurs métadonnées (titre, description, URL, README)

### 2. Récupération des repositories d'organisations

- **Endpoint** : `GET /github/orgs/repos`
- **Description** : Récupère tous les repositories (publics et privés) des organisations dont l'utilisateur est membre
- **Authentification** : Requiert un token GitHub valide avec les scopes `read:org`, `repo`, `user:email`
- **Réponse** : Liste des repositories d'organisations avec leurs métadonnées (titre, description, URL, README)
- **Fonctionnalités** :
  - Accès direct aux organisations si l'API standard échoue
  - Récupération automatique des README
  - Gestion d'erreurs robuste par organisation
  - Logs détaillés pour le debugging

## Architecture

### Structure Clean Architecture

```
github/
├── domain/                    # Entités et value objects (si nécessaire)
├── use-cases/
│   ├── commands/             # Commandes pour les actions d'écriture
│   ├── queries/              # Queries pour les actions de lecture
│   ├── ports/                # Interfaces abstraites
│   └── github.use-cases.ts   # Container des use cases
└── infrastructure/
    ├── controllers/          # Contrôleurs HTTP
    ├── repositories/         # Implémentations des repositories
    ├── services/            # Services métier
    └── github.infrastructure.ts
```

### Nouvelle fonctionnalité : Repositories d'organisations

#### Port ajouté

```typescript
// github-repository.port.ts
findRepositoriesOfOrganizations(
  octokit: Octokit,
): Promise<Result<GithubRepoListInput[], string>>;
```

#### Implémentation

```typescript
// github.repository.ts
async findRepositoriesOfOrganizations(
  octokit: Octokit,
): Promise<Result<GithubRepoListInput[], string>> {
  // 1. Vérifie les scopes du token GitHub
  // 2. Récupère les organisations via l'API standard
  // 3. Si aucune organisation trouvée, utilise l'accès direct
  // 4. Pour chaque organisation, récupère tous les repositories (publics et privés)
  // 5. Transforme les données en format standard
  // 6. Récupère les README pour chaque repository
  // 7. Gère les erreurs par organisation (continue même si une échoue)
  // 8. Retourne la liste complète avec logs détaillés
}
```

#### Query CQRS

```typescript
// find-organization-repositories.query.ts
export class FindOrganizationRepositoriesQuery implements IQuery {
  constructor(public readonly octokit: Octokit) {}
}

@QueryHandler(FindOrganizationRepositoriesQuery)
export class FindOrganizationRepositoriesQueryHandler
  implements IQueryHandler<FindOrganizationRepositoriesQuery> {
  // Logique de récupération via le repository
}
```

#### Endpoint

```typescript
// github.controller.ts
@Get('orgs/repos')
@UseGuards(GithubAuthGuard)
async getOrganizationRepositories(
  @GitHubOctokit() octokit: Octokit,
): Promise<GithubRepoListInput[]> {
  // Utilise directement le repository pour éviter les problèmes de typage CQRS
}
```

## Utilisation

### Exemple de requête

```bash
curl -X GET "http://localhost:4000/v1/github/orgs/repos" \
  -H "Cookie: sAccessToken=your-github-token"
```

### Exemple de réponse

```json
[
  {
    "owner": "LeetGrindBot",
    "title": "repository-name",
    "description": "Description du repository",
    "url": "https://github.com/LeetGrindBot/repository-name",
    "readme": "# Repository Name\n\nDescription du repository..."
  },
  {
    "owner": "opensource-together",
    "title": "project-name",
    "description": "Description du projet",
    "url": "https://github.com/opensource-together/project-name",
    "readme": "# Project Name\n\nDescription du projet..."
  }
]
```

## Gestion d'erreurs

### Codes d'erreur HTTP

- **401 Unauthorized** : Token GitHub invalide ou expiré
- **404 Not Found** : Erreur lors de la récupération des repositories
- **500 Internal Server Error** : Erreur serveur

### Gestion d'erreurs avancée

- **Fallback automatique** : Si l'API standard échoue, utilisation de l'accès direct
- **Erreurs par organisation** : Continue le traitement même si une organisation échoue
- **Logs d'erreur détaillés** : Informations complètes pour le debugging
- **Validation des scopes** : Vérification automatique des permissions du token

### Scopes requis

Le token GitHub doit avoir les scopes suivants :

- `read:org` : Pour lire les organisations
- `repo` : Pour accéder aux repositories privés
- `user:email` : Pour les informations utilisateur
- `read:user` : Pour les informations utilisateur

## Logs et Debugging

L'implémentation inclut des logs détaillés pour le debugging :

### Informations utilisateur

- Utilisateur authentifié
- Scopes du token GitHub
- Permissions disponibles

### Organisations

- Nombre d'organisations trouvées via l'API standard
- Liste des organisations détectées
- Fallback vers l'accès direct si nécessaire

### Repositories

- Nombre de repositories par organisation
- Erreurs spécifiques par organisation
- Total des repositories récupérés
- Détails des transformations de données

### Exemple de logs

```
[GithubRepository] Authenticated user: y2-znt
[GithubRepository] User scopes: admin:repo_hook, read:org, read:user, repo, user:email
[GithubRepository] Found 0 organizations
[GithubRepository] No organizations found via API, trying direct access...
[GithubRepository] Direct access to LeetGrindBot: 2 repositories
[GithubRepository] Direct access to opensource-together: 1 repositories
[GithubRepository] Total repositories from organizations: 3
```

## Tests

Les tests unitaires et d'intégration sont disponibles pour :

- La query `FindOrganizationRepositoriesQuery`
- Le contrôleur `GithubController`
- Le repository `GithubRepository`

## Améliorations futures

- ✅ **Accès direct aux organisations** : Implémenté pour contourner les limitations de l'API
- ✅ **Gestion d'erreurs robuste** : Continue même si une organisation échoue
- ✅ **Logs détaillés** : Debugging complet avec informations utilisateur et organisations
- 🔄 **Pagination** : Pour les grandes organisations avec beaucoup de repositories
- 🔄 **Filtrage avancé** : Par type de repository, langue, date de création
- 🔄 **Cache intelligent** : Pour améliorer les performances sur les organisations fréquemment consultées
- 🔄 **Permissions dynamiques** : Support des repositories avec des permissions spécifiques
- 🔄 **Métriques** : Statistiques d'utilisation et de performance
