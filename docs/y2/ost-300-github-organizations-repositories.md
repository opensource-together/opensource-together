# OST-331: Intégration des repositories d'organisations GitHub - OpenSource Together

## Description

Cette fonctionnalité permet de récupérer et gérer les repositories des organisations GitHub dont l'utilisateur est membre, en plus des repositories personnels déjà supportés.

## Fonctionnalités ajoutées

### 1. Récupération des repositories d'organisations

- **Endpoint**: `GET /v1/github/orgs/repos`
- **Authentification**: Requiert un token GitHub avec les scopes appropriés
- **Fonctionnalités**:
  - Récupération automatique des repositories publics
  - Support des organisations multiples
  - Récupération des README pour chaque repository
  - Gestion d'erreurs robuste par organisation
  - Fallback vers l'accès direct si l'API standard échoue

### 2. Scopes GitHub requis

Les tokens GitHub doivent maintenant inclure le scope `read:org` en plus des scopes existants :

- `read:org` : Pour accéder aux organisations
- `repo` : Pour les repositories privés
- `user:email` : Pour les informations utilisateur
- `read:user` : Pour les informations utilisateur

## Procédure de création d'un repository depuis une organisation

### 1. Prérequis

- Être membre d'une organisation GitHub
- Avoir les permissions appropriées dans l'organisation
- Token GitHub avec les scopes requis

### 2. Étapes de création

#### Étape 1: Accéder à l'organisation

1. Se connecter à GitHub
2. Naviguer vers l'organisation cible
3. Vérifier les permissions d'accès

#### Étape 2: Créer le repository

1. Dans l'organisation, cliquer sur "New repository"
2. Remplir les informations :
   - **Repository name**: Nom du projet
   - **Description**: Description du projet
   - **Visibility**: Public ou Private
   - **Initialize**: Cocher "Add a README file"
3. Cliquer sur "Create repository"

#### Étape 3: Configurer le repository

1. Ajouter un fichier `.gitignore` approprié
2. Créer une structure de dossiers cohérente
3. Documenter le projet dans le README

### 3. Intégration avec OpenSource Together

#### Étape 1: Synchronisation

1. Se connecter à l'application OpenSource Together
2. Aller dans la section "Mes Projets"
3. Cliquer sur "Importer depuis GitHub"
4. Sélectionner l'onglet "Organisations"
5. Choisir le repository créé

#### Étape 2: Configuration du projet

1. Remplir les informations du projet :
   - **Titre**: Nom du projet
   - **Description**: Description détaillée
   - **Technologies**: Stack technique utilisée
   - **Objectifs**: Buts du projet
2. Sauvegarder la configuration

## Procédure de fetch des repositories d'organisations

### 1. Via l'API REST

```bash
curl -X GET "http://localhost:4000/v1/github/orgs/repos" \
  -H "Cookie: sAccessToken=your-github-token"
```

### 2. Réponse attendue

```json
[
  {
    "owner": "OrganizationName",
    "title": "project-name",
    "description": "Description du projet",
    "url": "https://github.com/OrganizationName/project-name",
    "readme": "# Project Name\n\nDescription du projet..."
  }
]
```

### 3. Gestion d'erreurs

- **401 Unauthorized**: Token GitHub invalide ou expiré
- **404 Not Found**: Erreur lors de la récupération
- **500 Internal Server Error**: Erreur serveur

## Architecture technique

### Structure Clean Architecture

```
github/
├── use-cases/
│   ├── queries/
│   │   └── find-organization-repositories.query.ts
│   └── ports/
│       └── github-repository.port.ts
└── infrastructure/
    ├── controllers/
    │   └── github.controller.ts
    └── repositories/
        └── github.repository.ts
```

### Nouveaux composants

1. **FindOrganizationRepositoriesQuery**: Query CQRS pour la récupération
2. **GithubRepository.findRepositoriesOfOrganizations()**: Méthode de récupération
3. **GithubController.getOrganizationRepositories()**: Endpoint REST

## Tests et validation

### Tests unitaires

- Query handler pour la récupération des organisations
- Repository pour la transformation des données
- Contrôleur pour la gestion des erreurs

### Tests d'intégration

- End-to-end avec l'API GitHub
- Validation des scopes et permissions
- Gestion des erreurs réseau

## Logs et monitoring

### Informations loggées

- Utilisateur authentifié et ses scopes
- Organisations trouvées
- Nombre de repositories par organisation
- Erreurs spécifiques par organisation
- Total des repositories récupérés

### Exemple de logs

```
[GithubRepository] Authenticated user: username
[GithubRepository] User scopes: read:org, repo, user:email
[GithubRepository] Found 2 organizations
[GithubRepository] Organization org1: 5 repositories
[GithubRepository] Organization org2: 3 repositories
[GithubRepository] Total repositories from organizations: 8
```

## Améliorations futures

- [ ] Pagination pour les grandes organisations
- [ ] Filtrage par type de repository
- [ ] Cache intelligent pour les performances
- [ ] Support des permissions spécifiques
- [ ] Métriques d'utilisation

## Migration et compatibilité

### Changements breaking

- Ajout du scope `read:org` requis pour les tokens GitHub
- Nouveau endpoint `/v1/github/orgs/repos`

### Compatibilité

- Les repositories personnels continuent de fonctionner
- L'API existante reste inchangée
- Migration transparente pour les utilisateurs existants

## Documentation utilisateur

### Pour les développeurs

- Guide d'intégration des organisations
- Exemples de code pour l'API
- Gestion des erreurs et debugging

### Pour les utilisateurs finaux

- Tutoriel de création de repository d'organisation
- Guide d'import dans OpenSource Together
- FAQ sur les permissions et scopes
