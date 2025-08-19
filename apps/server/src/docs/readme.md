# Refacto backend

## Introduction

Ce document présente comment l'architecture a été repensée pour simplifier le back end, actuellement la modification devenait trop difficile à cause de ma volonté à appliquer des patterns complexe et potentiellement non approprié pour le début du projet. J'ai donc simplement réalisé une seule migration d'une fonctionnalité : **La création de projet**. Actuellement elle est incomplète et je vous laisse la finaliser avec les différentes parties de l'application à refactoriser et à migrer (telle que l'invitation d'un membre, la publication automatique du projet sur github etc.). Je vais expliquer comment je m'y suis pris et comment on devra appliquer de manière standard et conventionnelle la migration de `server_legacy`.

## Général

On enlève l'approche cqrs clean/archi etc, en suivant une approche Feature-First. Quelques éléments de la structure précédente conservent leurs emplacements, comme `auth`, `libs`, `media`, présents dans le dossier `src`.
À la racine du serveur, c'est maintenant là qu'est placée la `persistance`, dans le dossier `prisma` contenant les `migrations`, le fameux `schema.prisma`, `service`,`module`. Le `PrismaModule` est ajouté dans les `imports` des modules où on en a besoin, cela rend le `PrismaService` instancié une fois. Ça respecte les standards classiques d'un projet NestJS. Le `schema.prisma` a été refactorisé et pensé pour fonctionner avec `better-auth` qui est maintenant la libraire d'auth que l'on va utiliser, il suffit maintenant juste d'une image postgres dans le `docker-compose.dev.yml` Ça respecte les standards classiques d'un projet NestJS. Le `schema.prisma` a été refactorisé et pensé pour fonctionner avec `better-auth` qui est maintenant la lib que l'on va utiliser pour l'auth, il suffit maintenant juste d'une image postgres dans le `docker-compose.dev.yml`

## Structure générale

```
apps/server/src/
├── app.module.ts              # Module racine de l'application
├── main.ts                    # Point d'entrée
├── features/                  # Modules métier organisés par feature
├── libs/                      # Utilitaires partagés
├── auth/                      # Configuration d'authentification
├── media/                     # Gestion des médias
└── docs/                      # Documentation OpenAPI
```

## Structure des `features`

```
feature-name/
├── feature-name.module.ts     # Module NestJS de la feature
├── domain/                    # Logique métier et entités
├── repositories/              # Interfaces et implémentations des repositories
├── services/                  # Services métier (optionnel)
├── controllers/               # Contrôleurs HTTP (optionnel)
└── dto/                       # Data Transfer Objects (optionnel)
```

`domain`: Contient les types et les fonctions métier de validations de base, j'ai volontairement fait le minimum pour réduire la friction et garder de la flexibilité, mais n'hésite pas à rajouter du typage et à repasser dessus si vous avez une solution. Vous pourrez consulter un exemple pour `project.ts`. On passe donc de classe complexe avec des `vo`des`method` à un fichier où on se contente de faire des Type qui représentent l'entité métier concrète, et des types de DTO pour les fonctions de validations. On essaie de conserver la logique métier dans cet endroit pour éviter de la dupliquer. Seules les validations critiques non duplicables doivent rester dans le domaine 

`repositories`: Classique, pas trop de changement si ce n'est que maintenant les `ports` que l'on avait dans `use-cases` autrefois sont dans ce dossier-là avec une autre nomination comme par exemple `project.repository.interface.ts`, on y inscrit tous nos contrats des méthodes que l'on souhaite implémenter concrètement dans `prisma.project.repository.ts`. On garde la structure de `Result` pattern.

`services`: C'est là où on mettra tout ce qui était `command/commandHandler` et `query/queryHandler`, toutes nos méthodes, use case, seront dans le `service` associé à la `feature`, dans lequel on utilise les types/fonctions de règles métier présentes dans `domain`. On y injectera aussi les `repository` nécessaires, en continuant de dépendre des interfaces et tokens faits dans `repositories` par exemple. On garde la structure de `Result` pattern,

`controllers`: Classique, avec son dossier `dto` on continue de faire ce qu'on faisait comme avant pas de grand changement, si ce n'est que on ajoute les services dans le `constructor`, on vérifie si `result.success` est `true`, sinon on `throw` une erreur pour le client.

`module`: C'est comme ce qu'on faisait avec les `context.infrastructure.ts`, c'est ici dans `providers` qu'on relie nos `interface` avec nos implémentations concrètes comme une `prisma.repository`, on y ajoute le `service` en rapport avec le module ainsi que le `controller`. Pour pouvoir éviter les dépendances circulaires, ou les instanciations répétées, on `export` le token de notre `interface` pour notre `repository`, et le `service` ( voir exemple concret dans `project-role`) ça nous permet de n'avoir à importer que le `module` lui-même dans un autre, pour bénéficier de ses `service` et ses `repository` (comme expliqué plus haut avec `prisma` par exemple) vous pourrez le remarquer dans `project.module.ts` avec tous les modules que j'ai importés, et les différents `repositories` que j'utilise dans `project.service.ts` ( category, techstack etc)

Cette nouvelle structure suit les standard d'un projet nestjs classique.

Ont utilise le `Result` patren principalement dans `repositories` et `services`. Cela évite les exceptions non contrôlées et rend les erreurs explicites

## Flux global
```
HTTP POST /projects
   ↓ (DTO & validation transport)
Controller (ProjectController)
   ↓
Service (ProjectService.create)
   ↓ (validation métier du domaine)
Repository (ProjectRepository)
   ↓
Infra (PrismaProjectRepository → Prisma)
   ↑
Result<T, E> (ok/err) propagé jusqu’au controller
```