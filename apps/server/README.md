### Guide de Démarrage Rapide pour le Développement

1. **Prérequis**
   - Docker installé et en cours d'exécution
   - Node.js (version LTS recommandée)
   - PNPM installé globalement (`npm install -g pnpm`)

2. **Configuration de l'Environnement**

   a) Fichier `.env.dev` (dans le dossier `apps/`)
   ```env
   # Configuration Base de Données Métier
   BUSINESS_DB_NAME=app_database
   BUSINESS_DB_USER=postgres 
   BUSINESS_DB_PASSWORD=postgres
   BUSINESS_DB_PORT=5432

   # Configuration Base de Données SuperTokens
   SUPERTOKEN_DB_USER=postgres
   SUPERTOKEN_DB_PASSWORD=postgres
   SUPERTOKEN_DB_NAME=supertoken_db
   SUPERTOKEN_DB_PORT=5433
   SUPERTOKENS_API_KEY=api_key
   ```

   b) Fichier `.env` (dans le dossier `apps/server/`)
   ```env
   # Configuration Application
   APP_NAME=OST
   APP_DOMAIN=localhost
   FRONT_PORT=3000
   API_PORT=4000

   # Configuration SuperTokens
   SUPERTOKEN_URI=http://localhost:3567
   SUPERTOKEN_API_KEY=votre_clé_api
   WEBSITE_DOMAIN=http://localhost:3000
   API_DOMAIN=http://localhost:4000
   COOKIE_DOMAIN=localhost

   # URL Base de Données
   DATABASE_URL="postgresql://${BUSINESS_DB_USER}:${BUSINESS_DB_PASSWORD}@localhost:${BUSINESS_DB_PORT}/${BUSINESS_DB_NAME}?schema=public"
   ```

3. **Lancement des Services**

   ```bash
   # Dans le dossier apps/
   docker-compose -f docker-compose.dev.yml up 
   ```

4. **Configuration du Backend**

   ```bash
   # Dans le dossier apps/server/
   
   # Installation des dépendances
   pnpm install

   # Migration de la base de données
   pnpm prisma:migrate:dev

   # Démarrage du serveur en mode développement
   pnpm start:dev
   ```

5. **Configuration du Frontend**

   ```bash
   # Dans le dossier apps/web/
   
   # Installation des dépendances
   pnpm install

   # Démarrage du serveur de développement
   pnpm dev
   ```

### Points Importants

- Assurez-vous que tous les services Docker sont bien lancés avant de démarrer le backend
- Vérifiez les logs Docker en cas d'erreur : `docker-compose -f docker-compose.dev.yml logs`
- Le backend est accessible par défaut sur `http://localhost:4000`
- Le frontend est accessible par défaut sur `http://localhost:3000`
- Pour un redémarrage propre : 
  ```bash
  docker-compose -f docker-compose.dev.yml down
  docker-compose -f docker-compose.dev.yml up -d
  ```

### Dépannage

1. **Erreur de connexion à la base de données**
   - Vérifiez que les conteneurs Docker sont en cours d'exécution
   - Confirmez les informations de connexion dans les fichiers .env
   - Attendez quelques secondes après le démarrage des conteneurs

2. **Erreur de migration Prisma**
   - Supprimez le dossier `prisma/migrations` si nécessaire
   - Relancez la commande de migration
   - Vérifiez les logs Prisma pour plus de détails

3. **Problèmes de SuperTokens**
   - Vérifiez la connexion à `http://localhost:3567`
   - Confirmez la validité de la clé API
   - Vérifiez les configurations CORS
