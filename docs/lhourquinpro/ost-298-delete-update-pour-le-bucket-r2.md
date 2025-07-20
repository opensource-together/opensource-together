# OST-298 – update delete bucket r2 et refactorisation de la gestion des projets, key features, project goals, image et découplage des projectRoles

## Résumé des actions réalisées

- Refactorisation complète de la gestion des entités liées à un projet : key features, project goals, image.
- Découplage total de la gestion des projectRoles : plus aucune modification possible via la route PATCH projet, gestion via endpoints dédiés.
- Implémentation d'une logique incrémentale pour la mise à jour des key features et project goals (création, modification, suppression dans un seul payload, sans effet de bord).
- Ajout et gestion du champ image sur toute la chaîne (DTO, commande, repository, Prisma, API, migrations).
- Refactoring massif du code backend et frontend pour cohérence, robustesse et clarté.
- Implémentation complète du module media avec gestion des images via Cloudflare R2.
- Conservation d'endpoints dédiés pour les key features (fonctionnels mais optionnels).

---

## Changements structurels majeurs

### 1. Découplage total des projectRoles
- Suppression de toute gestion des projectRoles dans la commande de mise à jour de projet (`update-project.command.ts`) et dans le DTO associé.
- Les projectRoles sont désormais gérés exclusivement via des endpoints RESTful dédiés (création, modification, suppression, récupération).
- Séparation stricte des responsabilités : la route PATCH `/v1/projects/:id` ne touche plus aux rôles.

### 2. Gestion incrémentale des keyFeatures et projectGoals
- Les champs `keyFeatures` et `projectGoals` acceptent un tableau mixte :
  - `string` → création d'un nouvel élément
  - `{ id: string, feature/goal: string }` → modification d'un existant
  - Absence d'un id existant dans la liste → suppression
- Typage et validation adaptés dans le DTO et la commande.
- Logique Prisma modifiée pour :
  - Supprimer les éléments absents de la nouvelle liste
  - Mettre à jour ceux dont l'id est présent
  - Créer ceux qui n'ont pas d'id
- Plus de suppression globale suivie de recréation (plus de perte d'id, plus d'effets de bord).

### 3. Ajout et gestion du champ image
- Ajout du champ `image` dans le DTO, la commande, le mapper Prisma, la création et la mise à jour de projet.
- Migrations Prisma pour ajouter/supprimer le champ image dans le modèle Project.
- Le champ image est maintenant bien propagé de la requête à la réponse API, et géré dans toutes les opérations CRUD projet.

### 4. Module Media et gestion des images via R2
- Implémentation complète du module media avec service R2MediaService.
- Endpoints pour upload, suppression et changement d'images publiques vers Cloudflare R2.
- Gestion des clés d'images avec format timestamp-nomfichier pour éviter les conflits.
- Validation des types de fichiers (images uniquement) et gestion d'erreurs robuste.
- Service injectable via MediaServicePort pour utilisation dans les autres modules.

### 5. Endpoints dédiés conservés pour les key features
- Conservation des endpoints dans `ProjectKeyFeatureController` :
  - `DELETE /v1/projects/:projectId/key-features/:keyFeatureId` : suppression d'une key feature
  - `POST /v1/projects/:projectId/key-features` : création de key features
- Ces endpoints sont fonctionnels mais optionnels, car la gestion se fait aussi via la route PATCH projet.
- Conservation pour usage futur ou cas d'usage spécifiques.

### 6. Refactoring et nettoyage
- Suppression des anciennes méthodes de gestion des projectRoles dans la commande de projet.
- Nettoyage des imports, types, schémas, et mappers pour cohérence et robustesse.

### 7. Frontend
- Refactoring des composants pour utiliser la nouvelle API et les nouveaux types (projectRoles, keyFeatures, projectGoals, image).
- **Gestion des images dans les composants** : Modification du `project-hero.component.tsx` pour gérer l'affichage des images provenant de R2 vs images locales, évitant les erreurs Next.js Image avec les URLs externes.

### 8. Migrations Prisma
- Ajout du champ `image` dans le modèle Project.
- Ajout/suppression de clés liées à l'image selon l'évolution du modèle.
- Migrations pour garantir la cohérence du schéma avec la nouvelle logique métier.

---

## API et flux métier

### Endpoints de mise à jour de projet
- **PATCH `/v1/projects/:id`** :
  - Modifie uniquement les champs de base, keyFeatures, projectGoals, image, etc.
  - Ne modifie plus les projectRoles.
  - Les keyFeatures et projectGoals sont gérés de façon incrémentale, sans effet de bord, via un payload flexible (création, update, suppression dans un seul tableau).

### Endpoints projectRoles
- Création, modification, suppression, récupération via des routes RESTful dédiées.
- Découplage complet de la logique projet.

### Endpoints Media (R2)
- **POST `/v1/media/upload/image/public`** : Upload d'une nouvelle image
- **DELETE `/v1/media/delete/image/public/:key`** : Suppression d'une image
- **PATCH `/v1/media/change/image/public/:oldKey`** : Remplacement d'une image existante

### Endpoints Key Features (optionnels)
- **DELETE `/v1/projects/:projectId/key-features/:keyFeatureId`** : Suppression d'une key feature
- **POST `/v1/projects/:projectId/key-features`** : Création de key features

---
## Endpoints ProjectRoles

### Base URL
Tous les endpoints project-roles sont préfixés par `/v1/projects/:projectId/roles`

### 1. Récupérer tous les rôles d'un projet
- **GET `/v1/projects/:projectId/roles`**
- **Accès** : Public (authentification optionnelle)
- **Description** : Récupère tous les rôles d'un projet. Si l'utilisateur est connecté et a postulé pour un rôle, le champ `hasApplied` sera ajouté avec la valeur `true`.

**Paramètres :**
- `projectId` (string) : ID du projet

**Réponse 200 :**
```json
[
  {
    "id": "987fcdeb-51a2-4c3d-8f9e-1234567890ab",
    "projectId": "5f4cbe9b-1305-43a2-95ca-23d7be707717",
    "title": "Développeur Mobile",
    "description": "Développement de l'application mobile avec React Native",
    "isFilled": false,
    "techStacks": [
      {
        "id": "4",
        "name": "React Native",
        "iconUrl": "https://reactnative.dev/img/header_logo.svg"
      }
    ],
    "createdAt": "2025-07-05T15:30:00.000Z",
    "updatedAt": "2025-07-05T15:30:00.000Z"
  },
  {
    "id": "987fcdeb-51a2-4c3d-8f9e-1234567890ab",
    "projectId": "5f4cbe9b-1305-43a2-95ca-23d7be707717",
    "title": "Développeur Mobile",
    "description": "Développement de l'application mobile avec React Native",
    "isFilled": false,
    "techStacks": [
      {
        "id": "4",
        "name": "React Native",
        "iconUrl": "https://reactnative.dev/img/header_logo.svg"
      }
    ],
    "createdAt": "2025-07-05T15:30:00.000Z",
    "updatedAt": "2025-07-05T15:30:00.000Z",
    "hasApplied": true
  }
]
```

**Codes d'erreur :**
- `401` : Non authentifié
- `404` : Projet non trouvé

### 2. Créer un nouveau rôle de projet
- **POST `/v1/projects/:projectId/roles`**
- **Accès** : Authentifié (owner du projet uniquement)
- **Description** : Ajoute un nouveau rôle à un projet existant.

**Paramètres :**
- `projectId` (string) : ID du projet

**Body :**
```json
{
  "title": "Développeur Mobile",
  "description": "Développement de l'application mobile avec React Native",
  "techStacks": ["4", "5"]
}
```

**Réponse 201 :**
```json
{
  "id": "987fcdeb-51a2-4c3d-8f9e-1234567890ab",
  "projectId": "5f4cbe9b-1305-43a2-95ca-23d7be707717",
  "title": "Développeur Mobile",
  "description": "Développement de l'application mobile avec React Native",
  "isFilled": false,
  "techStacks": [
    {
      "id": "4",
      "name": "React Native",
      "iconUrl": "https://reactnative.dev/img/header_logo.svg"
    }
  ],
  "createdAt": "2025-07-05T15:30:00.000Z",
  "updatedAt": "2025-07-05T15:30:00.000Z"
}
```

**Codes d'erreur :**
- `400` : Erreur de validation
- `401` : Non authentifié
- `404` : Projet non trouvé

### 3. Mettre à jour un rôle de projet
- **PATCH `/v1/projects/:projectId/roles/:roleId`**
- **Accès** : Authentifié (owner du projet uniquement)
- **Description** : Met à jour un rôle de projet existant.

**Paramètres :**
- `projectId` (string) : ID du projet
- `roleId` (string) : ID du rôle à mettre à jour

**Body (tous les champs optionnels) :**
```json
{
  "title": "Backend Developer",
  "description": "Développeur backend responsable du développement des APIs et de la logique métier",
  "techStacks": ["2", "3"]
}
```

**Réponse 200 :**
```json
{
  "id": "6c65cc5b-cfe5-4f48-86f7-6efffd6d3916",
  "projectId": "3c2ee6b8-559e-42be-beb9-1807984270f3",
  "title": "Backend Developer",
  "description": "Développeur backend responsable du développement des APIs et de la logique métier",
  "isFilled": false,
  "techStacks": [
    {
      "id": "2",
      "name": "Next.js",
      "iconUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
    }
  ],
  "createdAt": "2025-07-14T12:35:08.064Z",
  "updatedAt": "2025-07-14T14:11:31.539Z"
}
```

**Codes d'erreur :**
- `400` : Erreur de validation
- `401` : Non authentifié
- `403` : Accès interdit (pas owner du projet)
- `404` : Rôle ou projet non trouvé

### 4. Supprimer un rôle de projet
- **DELETE `/v1/projects/:projectId/roles/:roleId`**
- **Accès** : Authentifié (owner du projet uniquement)
- **Description** : Supprime un rôle de projet existant.

**Paramètres :**
- `projectId` (string) : ID du projet
- `roleId` (string) : ID du rôle à supprimer

**Réponse 200 :**
```json
{
  "message": "Project role deleted successfully"
}
```

**Codes d'erreur :**
- `400` : Erreur de validation
- `401` : Non authentifié
- `403` : Accès interdit (pas owner du projet)
- `404` : Rôle ou projet non trouvé

### Notes importantes
- **Authentification** : Tous les endpoints de modification (POST, PATCH, DELETE) nécessitent une authentification et que l'utilisateur soit owner du projet.
- **GET public** : L'endpoint GET est public et supporte l'authentification optionnelle pour enrichir la réponse avec `hasApplied`.
- **Validation** : Tous les champs sont validés côté serveur (longueur, format, existence des tech stacks, etc.).
- **Sécurité** : Seuls les owners de projet peuvent créer, modifier ou supprimer des rôles.

---

## Guide d'utilisation pour les frontend

### Gestion des images

#### 1. Upload d'une nouvelle image
```typescript
// 1. Upload vers R2
const formData = new FormData();
formData.append('image', file);

const uploadResponse = await fetch('/v1/media/upload/image/public', {
  method: 'POST',
  body: formData,
});
const { url } = await uploadResponse.json();

// 2. Utiliser l'URL dans la mise à jour du projet
const projectUpdate = {
  // ... autres champs
  image: url
};
```

#### 2. Changement d'image existante
```typescript
// 1. Extraire la clé de l'ancienne image
// L'URL est au format: https://pub-xxx.r2.dev/1752701599288-filename.jpg
const oldImageUrl = project.image;
const oldKey = oldImageUrl.split('/').pop(); // "1752701599288-filename.jpg"

// 2. Upload de la nouvelle image avec remplacement
const formData = new FormData();
formData.append('image', newFile);

const changeResponse = await fetch(`/v1/media/change/image/public/${oldKey}`, {
  method: 'PATCH',
  body: formData,
});
const { url: newImageUrl } = await changeResponse.json();

// 3. Mettre à jour le projet avec la nouvelle URL
const projectUpdate = {
  // ... autres champs
  image: newImageUrl
};
```

#### 3. Suppression d'image
```typescript
// 1. Extraire la clé de l'image
const imageUrl = project.image;
const key = imageUrl.split('/').pop();

// 2. Supprimer de R2
await fetch(`/v1/media/delete/image/public/${key}`, {
  method: 'DELETE',
});

// 3. Mettre à jour le projet sans image
const projectUpdate = {
  // ... autres champs
  image: null
};
```

### Gestion des key features et project goals

#### Format du payload pour mise à jour incrémentale
```typescript
const projectUpdate = {
  // ... autres champs
  keyFeatures: [
    "Nouvelle feature", // Création
    { id: "existing-id", feature: "Feature modifiée" }, // Modification
    // Absence d'un id existant = suppression
  ],
  projectGoals: [
    "Nouveau goal", // Création
    { id: "existing-id", goal: "Goal modifié" }, // Modification
    // Absence d'un id existant = suppression
  ]
};
```

### Endpoints dédiés pour key features (optionnels)
```typescript
// Suppression d'une key feature spécifique
await fetch(`/v1/projects/${projectId}/key-features/${keyFeatureId}`, {
  method: 'DELETE',
});

// Création de key features
await fetch(`/v1/projects/${projectId}/key-features`, {
  method: 'POST',
  body: JSON.stringify({ features: ["Feature 1", "Feature 2"] }),
});
```

---

## Modifications frontend pour la gestion des images

### Problème rencontré
Lors de l'intégration des images R2, le composant `project-hero.component.tsx` rencontrait des erreurs avec le composant `next/image` de Next.js lors de l'affichage d'images provenant d'URLs externes (R2).

### Solution implémentée
Modification du composant pour gérer deux types d'images :

```typescript
// Dans project-hero.component.tsx
{image?.startsWith("http") ? (
  // Pour les images R2 (URLs externes) - utilisation de <img> standard
  <img
    src={image}
    alt={title}
    width={50}
    height={50}
    className="rounded-4xl sm:h-[65px] sm:w-[65px]"
  />
) : (
  // Pour les images locales - utilisation du composant Next.js Image optimisé
  <Image
    src={image || "/icons/empty-project.svg"}
    alt={title}
    width={50}
    height={50}
    className="rounded-4xl sm:h-[65px] sm:w-[65px]"
  />
)}
```

### Avantages de cette approche
- **Compatibilité** : Gestion transparente des images R2 et locales
- **Performance** : Utilisation du composant Next.js Image optimisé pour les images locales
- **Fallback** : Image par défaut si aucune image n'est fournie
- **Responsive** : Classes CSS adaptées pour mobile et desktop

### Points d'attention pour les développeurs frontend
- **URLs R2** : Commencent par "http" et nécessitent l'utilisation de `<img>` standard
- **Images locales** : Utilisent le composant Next.js `Image` pour l'optimisation
- **Fallback** : Toujours prévoir une image par défaut pour éviter les erreurs d'affichage
- **Performance** : Les images R2 ne bénéficient pas de l'optimisation automatique de Next.js

---

## Points d'attention

### Pour les développeurs backend
- Les tests unitaires et d'intégration doivent être mis à jour à chaque évolution du domain ou du mapping.
- Les migrations Prisma doivent être appliquées après chaque modification du schéma.
- Les endpoints sont sécurisés : bien vérifier les droits d'accès lors des appels API.
- La cohérence des types entre le frontend et le backend est essentielle pour éviter les effets de bord.

### Pour les développeurs frontend
- **Toujours passer par les endpoints media pour la gestion des images** avant de mettre à jour les entités.
- **Extraire correctement la clé de l'image** depuis l'URL R2 pour les opérations de changement/suppression.
- **Utiliser le format incrémental** pour les key features et project goals dans la mise à jour de projet.
- **Gérer les erreurs** de upload/suppression d'images avant de mettre à jour les entités.
- Les endpoints dédiés pour key features sont optionnels mais fonctionnels.

### Configuration requise
- Variables d'environnement R2 configurées (R2_BUCKET_NAME, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_URL).
- Module MediaInfrastructure correctement importé dans le ContextsModule.

---

## Conclusion

- La mise à jour d'un projet via PATCH `/v1/projects/:id` ne modifie plus les projectRoles, controller dédié dans `project-role.controller.ts`.
- Les keyFeatures et projectGoals sont gérés de façon incrémentale, sans effet de bord, via `PATCH projects/:projectId` (création, update, suppression dans un seul payload).
- Le champ image est correctement géré de bout en bout avec support complet de R2.
- Les rôles de projet sont gérés via des endpoints dédiés, découplés de la logique de mise à jour du projet.
- Le module media fournit une gestion complète des images avec upload, suppression et remplacement.
- Les endpoints dédiés pour key features sont conservés pour usage futur.