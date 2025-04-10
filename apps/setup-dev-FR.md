# OpenSource Together - Documentation de l'Environnement de Développement

## Vue d'Ensemble de l'Architecture

L'application se compose de 5 services principaux :

1. **Base de Données Métier** (PostgreSQL)
   - Port : 5433
   - Objectif : Base de données principale de l'application
   - Conteneur : apps-business_db-1

2. **Base de Données SuperTokens** (PostgreSQL)
   - Port : 5432
   - Objectif : Stockage des données d'authentification
   - Conteneur : apps-db-1

3. **SuperTokens Core**
   - Port : 3567
   - Objectif : Service d'authentification
   - Conteneur : apps-supertokens-1

4. **Backend (NestJS)**
   - Port : 4000
   - Objectif : Serveur API
   - Conteneur : apps-backend-1

5. **Frontend (Next.js)**
   - Port : 3000
   - Objectif : Application web
   - Conteneur : apps-frontend-1

## Dépendances des Services

```mermaid
graph TD
    Frontend --> Backend
    Backend --> BusinessDB
    Backend --> SuperTokens
    SuperTokens --> SuperTokensDB
```

## Améliorations Clés Apportées

1. **Résolution des Conflits de Ports**
   - Problème : Le frontend tentait d'utiliser le port 4000 qui était en conflit avec le backend
   - Solution : Configuration explicite du port Next.js à 3000 dans le Dockerfile et la commande
   ```dockerfile
   ENV PORT=3000
   CMD ["pnpm", "dev", "--port", "3000"]
   ```

2. **Connexions aux Bases de Données**
   - Séparation appropriée des bases de données métier et d'authentification
   - Mappings de ports explicites pour éviter les conflits
   - Vérifications de santé pour assurer la disponibilité des bases de données

3. **Dépendances des Services**
   - Ajout de conditions `depends_on` appropriées avec vérifications de santé
   - Assure le démarrage des services dans le bon ordre

## Lancement de l'Application

1. **Configuration Initiale**
```bash
# Cloner le dépôt
git clone <repository-url>
cd opensource-together/apps

# S'assurer que le fichier .env existe avec la configuration appropriée
cp .env.example .env
```

2. **Démarrage de l'Application**
```bash
# Construire et démarrer tous les services
docker compose up --build

# Ou démarrer en mode détaché
docker compose up -d --build
```

3. **Arrêt de l'Application**
```bash
# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (démarrage propre)
docker compose down -v
```

## Accès aux Bases de Données

### Base de Données Métier (Application Principale)
```bash
# Utilisation de docker exec
docker exec -it apps-business_db-1 psql -U postgres -d app_database

# Utilisation du client psql local
psql -h localhost -p 5433 -U postgres -d app_database
```

### Base de Données SuperTokens (Authentification)
```bash
# Utilisation de docker exec
docker exec -it apps-db-1 psql -U postgres -d opensource_together

# Utilisation du client psql local
psql -h localhost -p 5432 -U postgres -d opensource_together
```

## URLs des Services

- Frontend : http://localhost:3000
- API Backend : http://localhost:4000
- SuperTokens Core : http://localhost:3567

## Variables d'Environnement

Variables d'environnement clés dans `.env` :

```env
# Configuration de la Base de Données Métier
BUSINESS_DB_HOST=business_db
BUSINESS_DB_PORT=5432
BUSINESS_DB_USER=postgres
BUSINESS_DB_PASSWORD=postgres
BUSINESS_DB_NAME=app_database

# URL de la Base de Données pour Prisma
DATABASE_URL=postgresql://${BUSINESS_DB_USER}:${BUSINESS_DB_PASSWORD}@${BUSINESS_DB_HOST}:${BUSINESS_DB_PORT}/${BUSINESS_DB_NAME}?schema=public

# Configuration de l'API
PORT=4000
```

## Considérations Importantes

1. **Initialisation des Bases de Données**
   - Les deux bases de données sont initialisées au premier démarrage
   - Les migrations Prisma s'exécutent automatiquement via le script d'entrée
   - Les données persistent dans les volumes Docker entre les redémarrages

2. **Mode Développement**
   - Rechargement à chaud activé pour le frontend et le backend
   - Code source monté en volumes pour mises à jour en direct
   - Modules Node isolés dans des volumes séparés

3. **Configuration Réseau**
   - Tous les services dans le même réseau Docker (app_network)
   - Communication inter-services utilisant les noms des conteneurs comme hôtes
   - Accès externe via les ports mappés

4. **Vérifications de Santé**
   - Les services de base de données ont des vérifications de santé
   - SuperTokens core a une vérification de santé
   - Les services attendent que leurs dépendances soient saines

## Dépannage

1. **Conflits de Ports**
   ```bash
   # Vérifier si les ports sont déjà utilisés
   lsof -i :3000
   lsof -i :4000
   lsof -i :5432
   lsof -i :5433
   ```

2. **Logs des Conteneurs**
   ```bash
   # Voir les logs d'un service spécifique
   docker compose logs frontend
   docker compose logs backend
   docker compose logs business_db
   
   # Suivre les logs en temps réel
   docker compose logs -f
   ```

3. **Problèmes de Connexion aux Bases de Données**
   ```bash
   # Vérifier le statut des bases de données
   docker compose ps
   
   # Vérifier que les bases de données acceptent les connexions
   docker exec apps-business_db-1 pg_isready
   docker exec apps-db-1 pg_isready
   ```

## Opérations Courantes

1. **Reconstruire un Service Unique**
   ```bash
   docker compose up -d --build frontend
   docker compose up -d --build backend
   ```

2. **Redémarrer les Services**
   ```bash
   docker compose restart frontend
   docker compose restart backend
   ```

3. **Visualiser les Logs**
   ```bash
   # Tous les logs
   docker compose logs

   # Logs d'un service spécifique
   docker compose logs frontend
   docker compose logs backend
   ```

## Points à Considérer

1. **Configuration Production**
   - La configuration actuelle est uniquement pour le développement
   - La production nécessiterait :
     - Configuration SSL/TLS appropriée
     - Configurations spécifiques à l'environnement
     - Images Docker prêtes pour la production

2. **Stratégie de Sauvegarde**
   - Actuellement pas de solution de sauvegarde automatisée
   - Envisager la mise en place d'une stratégie de sauvegarde pour les bases de données

3. **Monitoring**
   - Pas de solution de monitoring en place
   - Envisager l'ajout de points de contrôle de santé
   - Envisager l'ajout d'agrégation de logs

# Détails de la Configuration Docker

## Dockerfile Backend (apps/server/Dockerfile)

```dockerfile
# Base image
FROM node:20-alpine
RUN apk add --no-cache postgresql-client

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy application source
COPY . .

# Make entrypoint script executable
RUN chmod +x ./entrypoint.sh

# Expose port
EXPOSE 4000

# Set environment to development
ENV NODE_ENV=development

# Command to run the app in development mode
CMD ["sh", "./entrypoint.sh"]
```

### Explication du Dockerfile Backend

1. **Image de Base & Outils**
   - Utilise `node:20-alpine` pour un environnement Node.js léger
   - Installe `postgresql-client` pour les outils CLI de base de données et les vérifications de santé
   - L'image basée sur Alpine réduit significativement la taille du conteneur

2. **Gestion des Paquets**
   - Utilise `pnpm` pour une gestion des paquets plus rapide et efficace
   - `--no-frozen-lockfile` permet les mises à jour de dépendances en développement

3. **Répertoire de Travail**
   - Définit `/usr/src/app` comme répertoire de travail
   - Pratique standard pour les applications Node.js en conteneurs

4. **Stratégie de Copie des Fichiers**
   - Copie d'abord les fichiers de paquets pour exploiter le cache des couches Docker
   - Code source copié après l'installation des dépendances
   - Optimise les temps de reconstruction pendant le développement

5. **Configuration du Point d'Entrée**
   - Rend `entrypoint.sh` exécutable
   - Le script gère :
     - Vérifications de connexion à la base de données
     - Migrations Prisma
     - Démarrage de l'application

## Dockerfile Frontend (apps/web/Dockerfile)

```dockerfile
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy application source
COPY . .

# Set the port explicitly
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev", "--port", "3000"]
```

### Explication du Dockerfile Frontend

1. **Configuration de Base**
   - Utilise la même base `node:20-alpine` pour la cohérence
   - Configure `pnpm` pour la gestion des paquets

2. **Répertoire de Travail**
   - Utilise `/app` comme répertoire de travail
   - Structure plus simple car pas d'outils de base de données nécessaires

3. **Configuration du Port**
   - Définit et expose explicitement le port 3000
   - Évite les conflits avec le backend
   - Utilise le flag de port Next.js pour garantir la liaison du port

4. **Mode Développement**
   - Exécute Next.js en mode développement avec rechargement à chaud
   - Exécution directe de la commande sans script intermédiaire

## Configuration Docker Compose (apps/docker-compose.yml)

```yaml
services:
  business_db:
    image: postgres:16
    env_file:
      - .env
    environment:
      - POSTGRES_USER=${BUSINESS_DB_USER}
      - POSTGRES_PASSWORD=${BUSINESS_DB_PASSWORD}
      - POSTGRES_DB=${BUSINESS_DB_NAME}
    ports:
      - "5433:5432"
    volumes:
      - business_db_data:/var/lib/postgresql/data
      - ./server/init-scripts:/docker-entrypoint-initdb.d
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'pg_isready', '-U', '${BUSINESS_DB_USER}', '-d', '${BUSINESS_DB_NAME}']
      interval: 5s
      timeout: 5s
      retries: 5

  db:
    image: postgres:16
    env_file:
      - .env
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}

  supertokens:
    image: registry.supertokens.io/supertokens/supertokens-postgresql:10.1.0
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3567:3567"
    env_file:
      - .env
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: >
        bash -c 'exec 3<>/dev/tcp/127.0.0.1/3567 && echo -e "GET /hello HTTP/1.1\r\nhost: 127.0.0.1:3567\r\nConnection: close\r\n\r\n" >&3 && cat <&3 | grep "Hello"'
      interval: 10s
      timeout: 5s
      retries: 5
    environment:
      - POSTGRESQL_CONNECTION_URI=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    env_file:
      - .env
    ports:
      - "${PORT}:${PORT}"
    volumes:
      - ./server:/usr/src/app
      - /usr/src/app/node_modules
    environment:
      - DATABASE_URL=postgresql://${BUSINESS_DB_USER}:${BUSINESS_DB_PASSWORD}@business_db:5432/${BUSINESS_DB_NAME}?schema=public
      - SUPERTOKENS_HOST=supertokens
      - SUPERTOKENS_PORT=3567
    networks:
      - app_network
    depends_on:
      business_db:
        condition: service_healthy
      supertokens:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./web
      dockerfile: Dockerfile
    env_file:
      - .env
    ports:
      - "3000:3000"
    volumes:
      - ./web:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
    networks:
      - app_network
    depends_on:
      - backend

volumes:
  business_db_data:
  db_data:

networks:
  app_network:
    driver: bridge
```

### Explication de la Configuration Docker Compose

1. **Services de Base de Données**
   
   a. **Base de Données Métier (business_db)**
   - PostgreSQL 16 pour les données de l'application
   - Port personnalisé (5433) pour éviter les conflits
   - Volume pour la persistance des données
   - Support des scripts d'initialisation
   - Configuration des vérifications de santé
   - Variables d'environnement depuis le fichier .env

   b. **Base de Données SuperTokens (db)**
   - PostgreSQL 16 pour les données d'authentification
   - Port standard (5432)
   - Volume séparé pour l'isolation des données
   - Configuration des vérifications de santé
   - Injection directe des variables d'environnement

2. **Service d'Authentification (supertokens)**
   - Image officielle SuperTokens
   - Dépend de l'état de santé de sa base de données
   - Vérification de santé personnalisée utilisant une connexion TCP
   - Configuration d'environnement pour la connexion à la base de données
   - Exposé sur le port 3567

3. **Service Backend**
   - Construction personnalisée utilisant le Dockerfile local
   - Montages de volumes pour le rechargement à chaud
   - Modules Node dans un volume anonyme
   - Variables d'environnement pour les deux bases de données
   - Dépend des deux bases de données et de SuperTokens
   - Dépendances des vérifications de santé

4. **Service Frontend**
   - Construction personnalisée utilisant le Dockerfile local
   - Montages de volumes pour le rechargement à chaud
   - Modules Node dans un volume anonyme
   - Configuration de l'URL de l'API
   - Dépend du service backend

5. **Réseau**
   - Réseau bridge personnalisé (app_network)
   - Découverte de services interne
   - Espace réseau isolé

6. **Volumes**
   - Volumes nommés pour les bases de données
   - Volumes anonymes pour node_modules
   - Montage du code source pour le développement

7. **Vérifications de Santé**
   - Vérifications de santé des bases de données utilisant pg_isready
   - Vérification de santé SuperTokens utilisant une requête HTTP
   - Assure un ordre de démarrage approprié des services

8. **Configuration de l'Environnement**
   - Utilisation cohérente du fichier .env
   - Variables d'environnement spécifiques aux services
   - Substitution de variables dans la configuration

Cette configuration fournit :
- Un environnement adapté au développement
- Persistance des données
- Isolation des services
- Ordre de démarrage approprié
- Rechargement à chaud
- Accès facile aux bases de données
- Configuration d'authentification sécurisée

La configuration est optimisée pour le développement tout en maintenant une séparation appropriée des préoccupations et en suivant les meilleures pratiques Docker.


Faites-moi savoir si vous avez besoin de clarifications ou si vous avez des questions sur des aspects spécifiques de la configuration !
