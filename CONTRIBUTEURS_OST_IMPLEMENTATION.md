# Implémentation des Contributeurs OST

## Problème résolu

**Avant :** Les contributeurs affichés sur la page projet provenaient de l'API GitHub, ce qui incluait des résultats indésirables comme `github-actions[bot]`, `lowlighter`, etc.

**Après :** Les contributeurs affichés sont uniquement les contributeurs OST (Open Source Together), c'est-à-dire les utilisateurs qui ont été acceptés sur une candidature de rôle par l'owner du projet.

## Changements apportés

### 1. Nouveau Query Handler (Backend)

**Fichier :** `apps/server/src/contexts/project/bounded-contexts/project-role-application/use-cases/queries/find-approved-contributors-by-project-id.query.ts`

- Nouveau handler `FindApprovedContributorsByProjectIdHandler`
- Récupère les candidatures avec status `APPROVAL` pour un projet
- Regroupe par utilisateur pour éviter les doublons
- Calcule le nombre de contributions (= nombre de rôles approuvés)
- Retourne un format compatible avec l'interface contributeur existante

### 2. Type OST Contributor

```typescript
export type OstContributor = {
  login: string;           // Username OST
  avatar_url: string;      // Avatar de l'utilisateur 
  html_url: string;        // Lien vers profil OST (http://localhost:4000/v1/user/:id)
  user_id: string;         // ID utilisateur OST
  contributions: number;   // Nombre de rôles approuvés
};
```

### 3. Handlers de projet modifiés

**Fichiers modifiés :**
- `apps/server/src/contexts/project/use-cases/queries/find-by-id/find-project-by-id.handler.ts`
- `apps/server/src/contexts/project/use-cases/queries/get-all/get-projects.handler.ts`

**Changements :**
- Utilisation du nouveau query OST au lieu de l'API GitHub pour les contributeurs
- Mise à jour des types `Contributor[]` → `OstContributor[]`
- Injection du `QueryBus` pour appeler le nouveau handler

### 4. DTOs mis à jour

**Fichiers modifiés :**
- `apps/server/src/contexts/project/infrastructure/controllers/dto/get-project-by-id-response.dto.ts`
- `apps/server/src/contexts/project/infrastructure/controllers/dto/get-projects-response.dto.ts`
- `apps/server/src/contexts/project/infrastructure/controllers/project.controller.ts`

**Changements :**
- Types des contributeurs mis à jour
- Import du type `OstContributor`

### 5. Types Frontend

**Fichier :** `apps/web/src/features/projects/types/project.type.ts`

- Ajout du type `OstContributor`
- Mise à jour de `ProjectStats` pour utiliser `OstContributor[]`

### 6. Exemples et documentation

**Fichier :** `apps/web/src/features/projects/mocks/ost-contributors.example.ts`

- Exemples de données contributeurs OST
- Comparaison avant/après

## Logique métier

### Définition d'un contributeur OST

Un contributeur OST est un utilisateur qui :
1. A postulé à un rôle sur un projet
2. A été **accepté** par l'owner du projet (status = `APPROVAL`)

### Calcul des contributions

- **Avant :** Nombre de commits GitHub
- **Après :** Nombre de rôles approuvés pour ce projet

### Regroupement des contributeurs

Si un utilisateur a plusieurs rôles approuvés sur le même projet, ses contributions sont additionnées.

Exemple :
- Utilisateur A approuvé pour "Frontend Developer" → 1 contribution
- Utilisateur A approuvé pour "UI/UX Designer" → Total = 2 contributions

## API Response Format

### Ancien format (GitHub)
```json
{
  "contributors": [
    {
      "login": "github-actions[bot]",
      "avatar_url": "https://avatars.githubusercontent.com/u/41898282?v=4",
      "html_url": "https://github.com/apps/github-actions", 
      "contributions": 25
    }
  ]
}
```

### Nouveau format (OST)
```json
{
  "contributors": [
    {
      "login": "Byron M",
      "avatar_url": "/icons/exemplebyronIcon.svg",
      "html_url": "http://localhost:4000/v1/user/user-123",
      "user_id": "user-123",
      "contributions": 3
    }
  ]
}
```

## Avantages

1. **Données pertinentes :** Plus de bots ou contributeurs externes non pertinents
2. **Cohérence :** Les contributeurs correspondent aux vrais membres de l'équipe OST
3. **Navigation :** Les liens pointent vers les profils OST internes 
4. **Traçabilité :** Le `user_id` permet une navigation et des analyses plus précises

## Tests et validation

### Backend
- Les types sont correctement compilés (pas d'erreurs TypeScript sur nos changements)
- Le nouveau query handler suit les patterns existants

### Frontend  
- Le type `OstContributor` est compatible avec l'interface existante
- Les mocks d'exemple montrent le format attendu

## Déploiement

Pour activer cette fonctionnalité :

1. **Backend :** Les changements sont déjà prêts et compilent correctement
2. **Base de données :** Nécessite des candidatures avec status `APPROVAL` 
3. **Frontend :** Compatible avec les changements backend sans modification

## Impact

- **✅ Résout :** Affichage de contributeurs non pertinents (bots, externes)
- **✅ Améliore :** Cohérence des données avec la logique métier OST
- **✅ Facilite :** Navigation vers les profils utilisateurs internes
- **⚠️ Dépend de :** Présence de candidatures approuvées dans la base