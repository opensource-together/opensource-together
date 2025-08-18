# Project Feature - Solution Simplifiée

## Problème Résolu

**Contexte** : Le frontend force l'utilisateur à envoyer tout en une fois (projet + project roles + team members), mais côté backend un projet peut exister sans ces éléments optionnels.

**Solution** : Tout dans le `ProjectService` avec validation séparée.

## Architecture Simplifiée

```
Frontend → CreateProjectDto → ProjectService → Repository → Database
```

### **DTO Unifié** (`CreateProjectDto`)
- Accepte tout ce que le frontend peut envoyer
- Champs obligatoires : `title`, `description`, `techStacks`, `categories`
- Champs optionnels : `projectRoles`, `teamMembers`

### **Service Principal** (`ProjectService`)
- Validation séparée par type d'élément
- Création atomique de tous les éléments
- Sauvegarde en base de données

## Validation Séparée dans le Service

### **Étape 1 : Projet de Base**
```typescript
const projectValidation = validateProject({
  ownerId, title, description, categories, techStacks
});
```

### **Étape 2 : Project Roles (Optionnels)**
```typescript
if (request.projectRoles && request.projectRoles.length > 0) {
  for (const roleDto of request.projectRoles) {
    const roleValidation = validateProjectRole({
      projectId: project.id || 'temp',
      title, description, techStacks
    });
  }
}
```

### **Étape 3 : Team Members (Optionnels)**
```typescript
if (request.teamMembers && request.teamMembers.length > 0) {
  for (const memberDto of request.teamMembers) {
    if (!memberDto.userId?.trim()) {
      return Result.fail({ teamMembers: 'User ID required' });
    }
  }
}
```

## Avantages de cette Approche

1. **Simplicité** : Un seul service, pas de sur-ingénierie
2. **Flexibilité** : Projet peut exister sans project roles ni team members
3. **Validation Granulaire** : Erreurs spécifiques par type d'élément
4. **Atomicité** : Tout est créé ensemble ou rien
5. **Maintenabilité** : Code simple et direct

## Utilisation

### Frontend
```typescript
const projectData = {
  title: "Mon Projet",
  description: "Description du projet",
  categories: [...],
  techStacks: [...],
  projectRoles: [ // Optionnel
    { title: "Dev", description: "...", techStacks: [...] }
  ],
  teamMembers: [ // Optionnel
    { userId: "user123", role: "Lead" }
  ]
};

const result = await api.createProject(projectData);
```

### Backend
```typescript
// Le ProjectService gère automatiquement :
// 1. Validation du projet de base
// 2. Validation des project roles (si présents)
// 3. Validation des team members (si présents)
// 4. Création atomique de tout
// 5. Sauvegarde en base via repository
```

## Tests

Les tests couvrent :
- ✅ Projet avec champs obligatoires uniquement
- ✅ Projet avec project roles
- ✅ Projet avec team members  
- ✅ Projet avec les deux
- ✅ Validation des erreurs par type

## Note Technique

Le repository Prisma devra être aligné avec l'interface `Project` simplifiée pour que tout fonctionne correctement. L'approche actuelle utilise des types `any[]` temporairement pour éviter les conflits de types.
