# OpenSource Together - Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

Backend de l'application OpenSource Together, construit avec le framework [NestJS](https://github.com/nestjs/nest).

## Configuration de l'environnement de développement

### Prérequis
- Docker et Docker Compose
- Node.js (version recommandée : 22.x)
- pnpm (gestionnaire de paquets)

### Structure du projet
Le projet utilise une architecture monorepo avec Docker pour l'environnement de développement. Les principaux composants sont :

- `Dockerfile.dev` : Configuration Docker pour l'environnement de développement
- `docker-compose.dev.yml` : Orchestration des services (backend, bases de données, etc.)
- `.env` : Variables d'environnement (copier `.env.example` pour commencer)

### Services Docker
- **backend** : Service NestJS principal
- **business-db** : Base de données PostgreSQL principale
- **supertokens-db** : Base de données pour l'authentification
- **supertokens** : Service d'authentification
- **migrate** : Service de migration Prisma

### Installation et démarrage

1. Cloner le projet et installer les dépendances :
```bash
# Installation des dépendances
pnpm install
```

2. Configurer l'environnement :
```bash
# Copier le fichier d'exemple
cp .env.example .env
# Éditer les variables selon vos besoins
```

3. Démarrer l'environnement de développement :
```bash
# Démarrer tous les services
docker compose -f docker-compose.dev.yml up --build
```

### Hot Reload et développement
Le projet est configuré avec le hot reload pour le développement. Les modifications du code source sont automatiquement détectées et appliquées.

### Installation de nouvelles dépendances
Pour installer de nouvelles dépendances et les synchroniser entre l'environnement local et le container :

```bash
# Installation locale et dans le container
pnpm install --save package-name && pnpm docker:backend:update
```

### Workflow de développement avec Prisma

#### Scripts utiles
```bash
# Mise à jour des dépendances dans le container
pnpm docker:backend:update

# Génération du client Prisma
pnpm prisma:generate

# Migration de la base de données (développement)
pnpm prisma:migrate:dev

# Déploiement des migrations
pnpm prisma:migrate:deploy

# Interface Prisma Studio
pnpm prisma:studio
```

#### Modifier le schéma Prisma
1. Modifier `src/infrastructures/orm/prisma/schema.prisma`
2. Lancer la commande de migration :
   ```sh
   pnpm prisma:migrate:dev
   ```
   Cette commande va :
   - Générer le client Prisma
   - Créer une nouvelle migration
   - Appliquer la migration à la base de données

3. Commiter les fichiers de migration générés

#### Réinitialiser la base de données
Si vous rencontrez des problèmes de synchronisation ou souhaitez repartir de zéro :

```sh
# Arrêter tous les containers
docker compose down

# Supprimer les volumes
docker compose down -v

# Redémarrer
docker compose up --build
```

### Points importants
- Le dossier `src/infrastructures/orm/prisma/migrations` doit TOUJOURS être versionné
- Ne JAMAIS modifier manuellement les fichiers de migration
- Toujours utiliser `pnpm prisma:migrate:dev` pour créer de nouvelles migrations
- Utiliser `pnpm prisma:migrate:deploy` pour appliquer les migrations existantes

## Tests

```bash
# Tests unitaires
pnpm test

# Tests end-to-end
pnpm test:e2e

# Couverture de tests
pnpm test:cov
```

## Ressources utiles

- [Documentation NestJS](https://docs.nestjs.com)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation SuperTokens](https://supertokens.com/docs)

## License

[MIT licensed](LICENSE)
