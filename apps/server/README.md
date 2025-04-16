<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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

### Scripts utiles
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

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Workflow de développement avec Prisma et Docker

### Premier démarrage
```sh
# Installer les dépendances
pnpm install

# Démarrer les containers
docker compose up --build
```

### Modifier le schéma Prisma
1. Modifie `src/infrastructures/orm/prisma/schema.prisma`
2. Lance la commande de migration :
   ```sh
   pnpm db:migrate
   ```
   Cette commande va :
   - Générer le client Prisma
   - Créer une nouvelle migration dans le dossier `prisma/migrations`
   - Appliquer la migration à la base de données

3. Commit les fichiers de migration générés :
   ```sh
   git add src/infrastructures/orm/prisma/migrations
   git commit -m "feat(db): add new migration for [description]"
   ```

### Après un git pull ou un changement de branche
1. Installer les dépendances si nécessaire :
   ```sh
   pnpm install
   ```

2. Appliquer les migrations :
   ```sh
   pnpm db:deploy
   ```

3. Redémarrer les services :
   ```sh
   docker compose restart backend
   ```

### Réinitialiser la base de données
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
- Toujours utiliser `pnpm db:migrate` pour créer de nouvelles migrations
- Utiliser `pnpm db:deploy` pour appliquer les migrations existantes

### Outils utiles
- `pnpm docker:prisma:studio` : Explorer la base de données
- `pnpm docker:backend <cmd>` : Exécuter une commande dans le container backend
- `pnpm db:migrate` : Créer et appliquer une nouvelle migration (développement)
- `pnpm db:deploy` : Appliquer les migrations existantes (production)
