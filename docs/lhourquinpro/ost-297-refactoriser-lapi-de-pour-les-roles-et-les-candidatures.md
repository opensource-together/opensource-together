# OST-297 – Refactorisation de l’API pour les rôles et les candidatures

## Résumé des actions réalisées

- Refactorisation complète de l’API pour la gestion des rôles (`ProjectRole`) et des candidatures (`ProjectRoleApplication`).
- Séparation stricte des contextes métier : chaque logique (rôle, candidature) a son propre dossier, use-cases, repository, controller.
- Correction des mappings entre entités domain et schéma Prisma (ajout de `projectId`, gestion correcte des relations).
- Ajout de nouveaux endpoints pour récupérer les candidatures par projet et par rôle.
- Sécurisation des accès : seuls les owners de projet peuvent voir toutes les candidatures de leur projet.
- Correction des tests unitaires et adaptation des tests d’intégration.
- Nettoyage des anciennes méthodes et suppression des endpoints obsolètes.
- Ajout d’un décorateur custom `@OptionalSession` (`src/libs/decorators/optional-session.decorator.ts`) pour permettre l’accès optionnel à la session utilisateur dans les controllers (utilisé pour exposer des endpoints publics tout en supportant l’auth si présente).

## Changements structurels majeurs

- Ajout du champ `projectId` dans l’entité `ProjectRoleApplication` pour coller au schéma Prisma.
- Refactorisation du repository Prisma pour utiliser les bons filtres (`projectRoleId`, `projectId`) et inclure les bonnes relations (`profile`, `projectRole`, `project`).
- Ajout de la méthode `findByRoleId` dans le repository et son port.
- Mise à jour du mapper pour gérer correctement la conversion entre domain et persistence (notamment pour les relations et le champ `projectId`).
- Refactorisation des handlers CQRS (command/query) pour utiliser la nouvelle structure et sécuriser l’accès aux données.
- Mise à jour du controller pour exposer les nouveaux endpoints RESTful et documenter les réponses attendues.
- Suppression des anciens dossiers, méthodes et endpoints non conformes à la nouvelle architecture.
- Mise à jour du `package.json` pour pointer toutes les commandes Prisma (migrate, generate, studio, etc.) vers le nouveau chemin du schéma : `src/persistence/orm/prisma/schema.prisma`.
- Création du dossier `bounded-contexts` regroupant `key-features`, `project-goals`, `project-role`, `project-role-application` dans `projects` pour une navigation dans les dossier plus intuitives.
- `project-role` et `project-role-application` ont leurs controllers.

## Configuration requise

### 1. Dépendances et environnement

1. Node.js version 22
2. PostgreSQL (voir `.env.example` pour la configuration)
3. Variables d’environnement à jour (notamment pour la base et les tokens éventuels)
4. Base migrée à jour (`pnpm prisma:migrate:dev:local`)

### 2. Vérification de la configuration

- Lancer Prisma Studio (`pnpm prisma:studio:local`) pour vérifier la structure et la présence des données.
- Vérifier que les champs `projectRoleId` et `projectId` sont bien renseignés dans la table `ProjectRoleApplication`.

## Utilisation

1. **Pré-requis** :  
   - Node version 22
   - Base PostgreSQL opérationnelle
   - Variables d’environnement correctement configurées

2. **Endpoints concernés** :  
   - `POST /projects/:projectId/roles/:roleId` : candidater à un rôle
   - `GET /projects/:projectId/roles/applications` : récupérer toutes les candidatures d’un projet (owner uniquement)
   - `GET /projects/:projectId/roles/:roleId/applications` : récupérer les candidatures pour un rôle précis (owner uniquement)

3. **Comportement** :  
   - Lorsqu’un utilisateur postule à un rôle, une candidature est créée et liée au bon projet/rôle/profil.
   - Les owners de projet peuvent lister toutes les candidatures de leur projet ou d’un rôle précis.
   - Les accès sont sécurisés : un utilisateur non-owner ne peut pas voir les candidatures d’un projet qui ne lui appartient pas.

## Points d'attention

- Les tests unitaires doivent être mis à jour à chaque évolution du domain ou du mapping.
- Les migrations Prisma doivent être appliquées après chaque modification du schéma.
- Les endpoints sont sécurisés : bien vérifier les droits d’accès lors des appels API.

---

## Bonus : Modifications et améliorations complémentaires

- **Décorateur `@OptionalSession`** :  
  Permet d’injecter l’`userId` de session si présent, ou `undefined` sinon. Utilisé dans les controllers pour exposer des endpoints publics tout en supportant l’authentification facultative (ex : listing des rôles d’un projet avec indication personnalisée si l’utilisateur a déjà postulé).

- **Endpoints ProjectRole (`project-roles.controller.ts`)** :  
  - Refactorisation de tous les endpoints pour supporter l’auth optionnelle, la documentation Swagger, et la gestion fine des erreurs.
  - Ajout du champ `hasApplied` dans la réponse des rôles pour indiquer si l’utilisateur courant a déjà postulé à un rôle donné.
  - endpoint `GET /projects/:projectId/roles` pour récupérer les roles indépendament (feedback @y2).
  - Séparation claire des accès publics (listing des rôles) et privés (création, édition, suppression).
  - Le décorateur `@OptionalSession()` permet de récupérer les roles pour un visiteurs non connecter de maniere classique, et pour un visiteur connecter d'enrichir la réponses as `hasApply`, utile pour que le user sache qu'il a deja apply a ce role, améliorant l'ux/ui.

- **Mise à jour du `package.json`** :  
  - Toutes les commandes Prisma (`prisma:generate:local`, `prisma:migrate:dev:local`, etc.) utilisent désormais le chemin `src/persistence/orm/prisma/schema.prisma` pour garantir la cohérence entre le code et la base.
  - Suppression des anciens scripts pointant vers des chemins obsolètes.

- **Linting et tests** :  
  - Correction des warnings ESLint et adaptation des tests unitaires pour la nouvelle structure.
  - Ajout de tests pour les nouveaux comportements (ex : accès optionnel, ownership).
