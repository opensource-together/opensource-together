# OST-307 : Implémentation du endpoint `GET user/applications`

## Résumé des actions réalisées

- Implémentation complète de la récupérations de toutes les candidatures d'un utilisateurs pour un/des projets.
- Ajout de la query `FindUserApplications` et `FindUserApplicationsHandler`
- Ajout de la propriétés `projectTitle` pour le model `ProjectRoleApplication` dans `schema.prisma`
- Refactorisation des use case de `project-application` pour s'adapter à la mise à jour du model.

## Changements structurels majeurs

### 1. Endpoints REST ajoutés
- **GET `/v1/user/applications`** : Récupérer toutes les candidatures personnel de l'utilisateur.

### 2. Améliorations du repository
- Mises à jours des méthode dans `PrismaProjectApplicationRepository` pour s'adapté au model.
- Mise à jour du port `ProjectRoleApplicationRepositoryPort` pour supporter les nouvelles méthodes
- Ajout de la nouvelle méthode `findAllByUserId`.


## Configuration requise

### 1. Dépendances et environnement
- Node.js version 22
- PostgreSQL avec les migrations à jour
- Variables d'environnement correctement configurées
- Base de données migrée (`pnpm prisma:migrate:dev:local`)

### 2. Vérification de la configuration
- Lancer Prisma Studio (`pnpm prisma:studio:local`) pour vérifier la structure des données
- Vérifier que les statuts de candidature sont correctement gérés dans la base de données

## Utilisation

### 1. Pré-requis
- Node version 22
- Base PostgreSQL opérationnelle
- Variables d'environnement correctement configurées
- Authentification utilisateur, seul un utilisateurs connecter peux consulter ses candidatures.
