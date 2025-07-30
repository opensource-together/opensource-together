# OST-312 : Refactorisation de l'API pour récupérer les projets d'un utilisateur authentifié

## Résumé des actions réalisées

- Implémentation complète des endpoints d'acceptation et de rejet des candidatures dans `ApplicationController`.
- Ajout de la query `GetApplicationByIdQuery` et `GetAllApplicationsByProjectsOwnerQuery` pour la gestion des candidatures.
- Refactorisation des commandes `AcceptUserApplicationCommand` et `RejectUserApplicationCommand` pour améliorer le traitement.
- Ajout de l'endpoint `GET /v1/user/projects` pour récupérer les projets d'un utilisateur spécifique.
- Fusion des entités `User` et `Profile` en une seule entité unifiée.
- Refactorisation de la gestion des profils utilisateurs avec `UpdateUserRequestDto`.

## Changements structurels majeurs

### 1. Endpoints REST ajoutés

#### Endpoints privés (authentification requise)
- **GET `/v1/user/me`** : Récupérer le profil de l'utilisateur courant.
- **PATCH `/v1/user/me`** : Mettre à jour le profil de l'utilisateur courant.
- **DELETE `/v1/user/me`** : Supprimer le profil de l'utilisateur courant.
- **GET `/v1/user/me/applications`** : Récupérer toutes les candidatures de l'utilisateur courant.

#### Endpoints publics (accès libre)
- **GET `/v1/user/:id`** : Récupérer un utilisateur par son ID (sans email et login).
- **GET `/v1/user/:userId/projects`** : Récupérer les projets d'un utilisateur spécifique.

#### Endpoints de gestion des candidatures
- **PATCH `/v1/applications/:id`** : Accepter ou rejeter une candidature avec statut et raison optionnelle.
- **GET `/v1/applications/:id`** : Récupérer les détails d'une candidature par ID.
- **GET `/v1/applications`** : Récupérer toutes les candidatures des projets d'un propriétaire.




### 2. Améliorations du repository
- Ajout des méthodes `acceptApplication` et `rejectApplication` dans `ProjectRoleApplicationRepository`.
- Mise à jour du port `ProjectRoleApplicationRepositoryPort` pour supporter les nouvelles méthodes.
- Amélioration de la méthode de vérification des candidatures existantes avec `existsStatusApplication`.

### 3. Refactorisation des entités
- Consolidation de l'entité `Profile` dans l'entité `User`, supprimant la table `Profile`.
- Mise à jour de l'entité `User` avec des champs supplémentaires (login, avatarUrl, location, company, bio, socialLinks, techStacks, experiences, projects).
- Introduction de `UpdateUserRequestDto` pour structurer les mises à jour de profil.

## Configuration requise

### 1. Dépendances et environnement
- Node.js version 22
- PostgreSQL avec les migrations à jour
- Variables d'environnement correctement configurées
- Base de données migrée (`pnpm prisma:migrate:dev:local`)

### 2. Vérification de la configuration
- Lancer Prisma Studio (`pnpm prisma:studio:local`) pour vérifier la structure des données
- Vérifier que les statuts de candidature sont correctement gérés dans la base de données
- S'assurer que les nouvelles relations User-Project sont fonctionnelles

## Utilisation

### 1. Pré-requis
- Node version 22
- Base PostgreSQL opérationnelle
- Variables d'environnement correctement configurées
- Authentification utilisateur pour les endpoints protégés

### 2. Endpoints concernés

#### Accepter/Rejeter une candidature
```bash
# Accepter une candidature
PATCH /v1/applications/:id
Body: { "status": "APPROVAL" }

# Rejeter une candidature
PATCH /v1/applications/:id
Body: { "status": "REJECTED", "rejectionReason": "Raison optionnelle" }
```

#### Récupérer les candidatures
```bash
# Toutes les candidatures d'un propriétaire de projet
GET /v1/applications

# Détails d'une candidature spécifique
GET /v1/applications/:id
```

#### Récupérer les projets d'un utilisateur
```bash
# Projets d'un utilisateur authentifié
GET /v1/user/projects
```

### 3. Comportement
- Les endpoints d'acceptation/rejet nécessitent que l'utilisateur soit propriétaire du projet
- Les candidatures acceptées marquent automatiquement le rôle comme pourvu
- Les candidatures rejetées permettent à l'utilisateur de postuler à nouveau
- L'endpoint de récupération des projets retourne uniquement les projets de l'utilisateur authentifié

## Points d'attention

### Pour les développeurs backend
- Les tests unitaires et d'intégration doivent être mis à jour pour couvrir les nouveaux endpoints
- Les migrations Prisma doivent être appliquées après chaque modification du schéma
- Les endpoints sont sécurisés : seuls les propriétaires peuvent accepter/rejeter des candidatures
- La cohérence des statuts de candidature doit être maintenue

### Pour les développeurs frontend
- Les nouveaux endpoints permettent une gestion complète du cycle de vie des candidatures
- L'interface utilisateur doit refléter les différents statuts de candidature
- Les actions d'acceptation/rejet doivent être limitées aux propriétaires de projet
- La mise à jour en temps réel des statuts améliore l'expérience utilisateur

