# GET STARTED Back end

## Pré requis:

- Node 22 ( Obligatoire, sinon vous aurez des erreurs à cause de la lib `Octokit` )
- Docker
- pnpm 10

## Démarage :

Après avoir clone le projet, faite la commande `pnpm i` dans le dossier `apps/server/`, une fois les dépendance installé, démarrer le container de la base de données avec Docker.

### Base de données:

Lancer le docker compose de développement `docker-compose.dev.yml` pour la base de donnée :

- La première fois faite un build :

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

- Pour les autres fois, un simple `up -d` suffit:

```bash
docker compose -f docker-compose.dev.yml up -d
```

### ORM

Une fois le container de la base de données lancer, 