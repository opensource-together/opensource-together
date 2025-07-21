# OST-303 : Implémentation des endpoints d'acceptation et de rejet des candidatures aux rôles de projet

## Résumé des actions réalisées

- Implémentation complète des fonctionnalités d'acceptation et de rejet des candidatures aux rôles de projet.
- Ajout des commandes `AcceptUserApplicationCommand` et `RejectUserApplicationCommand` avec leurs handlers respectifs.
- Création des endpoints REST pour accepter et rejeter les candidatures dans `ProjectRoleApplicationController`.
- Amélioration de la logique de gestion des statuts de candidature avec support des statuts 'PENDING' et 'REJECTED'.
- Refactorisation de la logique de vérification des candidatures existantes pour une meilleure clarté.
- Optimisation du filtrage des rôles de projet en excluant les rôles déjà pourvus.
- Nettoyage du code en supprimant les fichiers obsolètes et en améliorant l'encapsulation.

## Changements structurels majeurs

### 1. Nouvelles commandes et handlers
- **AcceptUserApplicationCommand** : Commande pour accepter une candidature utilisateur
- **RejectUserApplicationCommand** : Commande pour rejeter une candidature utilisateur
- **AcceptUserApplicationCommandHandler** : Handler pour traiter l'acceptation des candidatures
- **RejectUserApplicationCommandHandler** : Handler pour traiter le rejet des candidatures

### 2. Endpoints REST ajoutés
- **PATCH `/v1/projects/:projectId/roles/applications/:applicationId/accept`** : Accepter une candidature
- **PATCH `/v1/projects/:projectId/roles/applications/:applicationId/reject`** : Rejeter une candidature

### 3. Améliorations du repository
- Ajout des méthodes `acceptApplication` et `rejectApplication` dans `ProjectRoleApplicationRepository`
- Mise à jour du port `ProjectRoleApplicationRepositoryPort` pour supporter les nouvelles méthodes
- Amélioration de la méthode de vérification des candidatures existantes

### 4. Refactorisation et optimisations
- Renommage de `existsPendingApplication` vers `existsStatusApplication` pour plus de clarté
- Mise à jour de la logique pour vérifier les statuts 'PENDING' et 'REJECTED'
- Optimisation du `GetProjectRolesQueryHandler` pour exclure les rôles déjà pourvus
- Suppression du fichier obsolète `example-queries.container.ts`

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
- Authentification utilisateur (seuls les owners de projet peuvent accepter/rejeter)

### 2. Endpoints concernés

#### Accepter une candidature
- **PATCH** `/v1/projects/:projectId/roles/applications/:applicationId/accept`
- **Accès** : Authentifié (owner du projet uniquement)
- **Description** : Accepte une candidature en attente et marque le rôle comme pourvu

**Paramètres :**
- `projectId` (string) : ID du projet
- `applicationId` (string) : ID de la candidature à accepter

**Réponse 200 :**
```json
{
  "message": "Application accepted successfully",
  "application": {
    "id": "application-id",
    "status": "ACCEPTED",
    "projectRole": {
      "id": "role-id",
      "title": "Développeur Frontend",
      "isFilled": true
    }
  }
}
```

**Codes d'erreur :**
- `400` : Candidature déjà acceptée ou rejetée
- `401` : Non authentifié
- `403` : Pas owner du projet
- `404` : Candidature ou projet non trouvé

#### Rejeter une candidature
- **PATCH** `/v1/projects/:projectId/roles/applications/:applicationId/reject`
- **Accès** : Authentifié (owner du projet uniquement)
- **Description** : Rejette une candidature en attente

**Paramètres :**
- `projectId` (string) : ID du projet
- `applicationId` (string) : ID de la candidature à rejeter

**Réponse 200 :**
```json
{
  "message": "Application rejected successfully",
  "application": {
    "id": "application-id",
    "status": "REJECTED"
  }
}
```

**Codes d'erreur :**
- `400` : Candidature déjà acceptée ou rejetée
- `401` : Non authentifié
- `403` : Pas owner du projet
- `404` : Candidature ou projet non trouvé

### 3. Comportement

#### Gestion des statuts de candidature
- **PENDING** : Candidature en attente de traitement
- **ACCEPTED** : Candidature acceptée, le rôle devient pourvu (`isFilled: true`)
- **REJECTED** : Candidature rejetée, le rôle reste disponible

#### Logique de vérification des candidatures existantes
- La méthode `existsStatusApplication` vérifie les candidatures avec statut 'PENDING' ou 'REJECTED'
- Un utilisateur peut postuler à nouveau après un rejet
- Un utilisateur ne peut pas postuler plusieurs fois avec le même statut

#### Filtrage des rôles
- Les rôles déjà pourvus (`isFilled: true`) sont automatiquement exclus des listes
- Cela améliore les performances et l'expérience utilisateur

## Architecture technique

### Flux de traitement d'une acceptation
1. Validation de l'authentification et des droits d'owner
2. Récupération de la candidature et vérification de son statut
3. Mise à jour du statut de la candidature vers 'ACCEPTED'
4. Mise à jour du rôle de projet (`isFilled: true`)
5. Retour de la réponse avec les détails mis à jour

### Flux de traitement d'un rejet
1. Validation de l'authentification et des droits d'owner
2. Récupération de la candidature et vérification de son statut
3. Mise à jour du statut de la candidature vers 'REJECTED'
4. Le rôle reste disponible pour d'autres candidatures
5. Retour de la réponse avec les détails mis à jour

### Gestion des erreurs
- Validation stricte des droits d'accès (owner uniquement)
- Vérification des statuts de candidature avant traitement
- Gestion des cas où la candidature ou le projet n'existe pas
- Messages d'erreur explicites pour faciliter le debugging

## Points d'attention

### Pour les développeurs backend
- Les tests unitaires et d'intégration doivent être mis à jour pour couvrir les nouveaux endpoints
- Les migrations Prisma doivent être appliquées après chaque modification du schéma
- Les endpoints sont sécurisés : seuls les owners peuvent accepter/rejeter des candidatures
- La cohérence des statuts de candidature doit être maintenue

### Pour les développeurs frontend
- Les nouveaux endpoints permettent une gestion complète du cycle de vie des candidatures
- L'interface utilisateur doit refléter les différents statuts de candidature
- Les actions d'acceptation/rejet doivent être limitées aux owners de projet
- La mise à jour en temps réel des statuts améliore l'expérience utilisateur

### Sécurité
- Validation stricte des droits d'accès pour chaque opération
- Vérification de l'existence et du statut des candidatures avant traitement
- Protection contre les modifications non autorisées
- Logs appropriés pour auditer les actions d'acceptation/rejet

## Améliorations futures possibles

- Notifications par email lors d'acceptation/rejet de candidature
- Historique des actions d'acceptation/rejet
- Possibilité de commenter un rejet pour expliquer la décision
- Statistiques sur les taux d'acceptation/rejet par projet
- Workflow d'approbation multi-étapes pour les projets complexes

## Conclusion

L'implémentation des endpoints d'acceptation et de rejet des candidatures complète le cycle de vie de la gestion des rôles de projet. Cette fonctionnalité permet aux owners de projet de gérer efficacement les candidatures reçues, tout en maintenant une séparation claire des responsabilités et une sécurité appropriée. L'architecture modulaire facilite les évolutions futures et maintient la cohérence avec l'architecture existante du projet. 