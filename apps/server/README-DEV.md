# Guide de Développement - Server

## Démarrage rapide

### 1. Prérequis
- Docker et Docker Compose installés
- Node.js 22+ et pnpm installés

### 2. Configuration
```bash
# Copier le fichier d'environnement
cp env.example .env

# Installer les dépendances
pnpm install
```

### 3. Démarrer la base de données
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Appliquer les migrations existantes
```bash
pnpm prisma:migrate:deploy
```

### 5. Démarrer le serveur
```bash
pnpm start:dev
```

## Commandes Prisma

```bash
# Générer le client Prisma
pnpm prisma:generate

# Appliquer les migrations existantes
pnpm prisma:migrate:deploy

# Créer une nouvelle migration (après modification du schéma)
pnpm prisma:migrate:dev

# Pousser le schéma (pour le développement rapide)
pnpm prisma:push

# Ouvrir Prisma Studio
pnpm prisma:studio
```

## Connexion à la base de données

- **Host**: localhost
- **Port**: 5432
- **Database**: ost_dev
- **User**: ost_user
- **Password**: ost_password

## Commandes Docker

```bash
# Démarrer PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Arrêter PostgreSQL
docker-compose -f docker-compose.dev.yml down

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f
```
