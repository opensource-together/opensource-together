# OST - Refactorisation de la gestion des profils et implémentation des techStacks

## Résumé des actions réalisées

- Refactorisation complète de la structure des `socialLinks` pour passer d'un tableau à un objet simple.
- Remplacement du système de `skills` par `techStacks` avec intégration du type (`LANGUAGE` | `TECH`).
- Amélioration des composants frontend pour gérer les nouveaux formats de données.
- Mise à jour des DTOs, mappers et repositories pour s'aligner sur la nouvelle architecture.
- Ajout d'une migration pour la table TechStack avec la nouvelle colonne `type`.

## Changements structurels majeurs

### 1. Simplification des socialLinks
- **Avant** : Array de `{ type: string, url: string }`
- **Après** : Objet simple `{ github?: string, discord?: string, twitter?: string, linkedin?: string, website?: string }`
- Avantages :
  - Plus intuitif pour les formulaires
  - Validation plus simple
  - Meilleure performance (pas de `.find()` ou `.reduce()`)

### 2. Intégration des techStacks
- Remplacement complet du système de `skills` par `techStacks`
- Ajout du champ `type` pour différencier les langages des technologies
- Structure unifiée :
```typescript
type TechStack = {
  id: string;
  name: string;
  iconUrl: string;
  type: "LANGUAGE" | "TECH";
};
```

### 3. Améliorations Frontend
- **ProfileHero** : Nouveau rendu des techStacks avec icônes et badges
- **ProfileEditForm** : 
  - Adaptation pour utiliser l'objet `socialLinks`
  - Support du type pour les techStacks

### 4. Modifications Backend
- Mise à jour du schéma Prisma avec la nouvelle colonne `type` sur TechStack
- Adaptation des mappers pour la conversion entre formats
- Optimisation des requêtes avec les nouvelles relations

## Configuration requise

### 1. Migration de la base de données
```bash
pnpm prisma:migrate:dev:local
```

### 2. Vérification des types
```bash
# Dans apps/server
pnpm run build

# Dans apps/web
pnpm run build
```

## Points d'attention

### Pour les développeurs backend
- Les anciennes références à `skills` ont été supprimées
- Les mappers doivent gérer la conversion entre formats pour la rétrocompatibilité
- La validation des techStacks inclut maintenant le champ `type`

### Pour les développeurs frontend
- Utiliser l'objet `socialLinks` directement plutôt que de le convertir en array
- Les techStacks doivent toujours inclure leur `type`
- Le composant ProfileHero convertit maintenant les socialLinks en array pour l'affichage

## Migration des données existantes

Pour les projets existants utilisant l'ancien format :

1. Les socialLinks sont automatiquement convertis lors de la lecture
2. Les skills sont migrés vers techStacks avec type par défaut "TECH"
3. Les anciennes relations sont préservées
1. Les socialLinks sont automatiquement convertis lors de la lecture
2. Les skills sont migrés vers techStacks avec type par défaut "TECH"
3. Les anciennes relations sont préservées
