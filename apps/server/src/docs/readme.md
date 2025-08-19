# Refacto backend

## Introduction

Ce document présente comment l'architecture a été repensée pour simplifier le back end, actuellement la modification devenait trop difficile à cause de ma volonté à appliquer des patterns complexe et potentiellement non approprié pour le début du projet. J'ai donc simplement réalisé une seule migration d'une fonctionnalité : **La création de projet**. Actuellement elle est incomplète et je vous laisse la finaliser avec les différentes parties de l'application à refactoriser et à migrer (telle que l'invitation d'un membre, la publication automatique du projet sur github etc.). Je vais expliquer comment je m'y suis pris et comment on devra appliquer de manière standard et conventionnelle la migration de `server_legacy`.

L’exemple présenté avec `projet` montre comment cela devrait s’appliquer pour toutes les autres fonctionnalités futures, et celles à migrer/refactoriser.

## Général

On enlève l'approche cqrs clean/archi etc, en suivant une approche Feature-First. Quelques éléments de la structure précédente conservent leurs emplacements, comme `auth`, `libs`, `media`, présents dans le dossier `src`.
À la racine du serveur, c'est maintenant là qu'est placée la `persistance`, dans le dossier `prisma` contenant les `migrations`, le fameux `schema.prisma`, `service`,`module`. Le `PrismaModule` est ajouté dans les `imports` des modules où on en a besoin, cela rend le `PrismaService` instancié une fois. Ça respecte les standards classiques d'un projet NestJS. Le `schema.prisma` a été refactorisé et pensé pour fonctionner avec `better-auth` qui est maintenant la libraire d'auth que l'on va utiliser, il suffit maintenant juste d'une image postgres dans le `docker-compose.dev.yml` Ça respecte les standards classiques d'un projet NestJS. 

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
Result<T, E> (ok/err) propagé jusqu'au controller
```

## Exemples Concrets - Feature Project

### 1. Domain - Types et Validations

```typescript
// domain/project.ts
export interface Project {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  image: string;
  categories: Category[];
  techStacks: TechStack[];
  projectRoles?: ProjectRole[];
  teamMembers?: TeamMember[];
  coverImages?: string[];
  readme?: string;
  externalLinks?: ExternalLink[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ValidateProjectDto {
  ownerId: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  techStacks: string[];
  coverImages?: string[];
  readme?: string;
  externalLinks?: ExternalLink[];
}

export function validateProject(
  project: Partial<ValidateProjectDto>,
): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (!project.ownerId) errors.ownerId = 'domain: Owner ID is required';
  if (!project.title?.trim()) errors.title = 'domain: Title is required';
  if (project.title && project.title.length < 3)
    errors.title = 'domain: Title must be at least 3 characters';
  // ... autres validations

  return Object.keys(errors).length > 0 ? errors : null;
}
```

### 2. Repository Interface - Contrat

```typescript
// repositories/project.repository.interface.ts
export interface CreateProjectData {
  ownerId: string;
  title: string;
  description: string;
  categories: string[];
  techStacks: string[];
  projectRoles?: {
    title: string;
    description: string;
    techStacks: string[];
  }[];
  externalLinks?: { type: string; url: string }[];
  image?: string;
  coverImages?: string[];
  readme?: string;
}

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepository {
  create(data: CreateProjectData): Promise<Result<Project, string>>;
  findByTitle(title: string): Promise<Result<Project, string>>;
}
```

### 3. Repository Implementation - Prisma

```typescript
// repositories/prisma.project.repository.ts
@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectData: CreateProjectData,
  ): Promise<Result<DomainProject, string>> {
    try {
      const savedProject = await this.prisma.project.create({
        data: {
          ownerId: projectData.ownerId,
          title: projectData.title,
          description: projectData.description,
          image: projectData.image,
          techStacks: {
            connect: projectData.techStacks.map((tech) => ({ id: tech })),
          },
          categories: {
            connect: projectData.categories.map((cat) => ({ id: cat })),
          },
          projectRoles: {
            create: projectData.projectRoles?.map((role) => ({
              title: role.title,
              description: role.description,
              isFilled: false,
              techStacks: {
                connect: role.techStacks.map((tech) => ({ id: tech })),
              },
            })),
          },
        },
        include: {
          techStacks: true,
          categories: true,
          projectRoles: {
            include: {
              techStacks: true,
            },
          },
          // ... autres includes
        },
      });

      return Result.ok({
        // Mapping vers le domaine
        ownerId: savedProject.ownerId,
        title: savedProject.title,
        // ... autres propriétés
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return Result.fail('DUPLICATE_PROJECT');
        }
      }
      return Result.fail('DATABASE_ERROR');
    }
  }
}
```

### 4. Service - Logique Métier

```typescript
// services/project.service.ts
@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(TECH_STACK_REPOSITORY)
    private readonly techStackRepository: TechStackRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createProject(
    request: CreateProjectRequest,
  ): Promise<Result<Project, any>> {
    try {
      // Vérification unicité
      const existingProject = await this.projectRepository.findByTitle(
        request.title,
      );
      if (existingProject.success) {
        return Result.fail('DUPLICATE_PROJECT');
      }

      // Validation des références
      const validTechStacksProject = await this.techStackRepository.findByIds(
        request.techStacks,
      );
      if (!validTechStacksProject.success) {
        return Result.fail('TECH_STACK_NOT_FOUND');
      }

      // Validation du domaine
      const projectValidation = validateProject({
        ownerId: request.ownerId,
        title: request.title,
        description: request.description,
        techStacks: request.techStacks,
        categories: request.categories,
      });
      if (projectValidation) {
        return Result.fail(projectValidation);
      }

      // Validation des project roles
      const projectRolesValidation = request.projectRoles?.map((role) =>
        validateProjectRole({
          title: role.title,
          description: role.description,
          techStacks: role.techStacks,
        }),
      );
      if (projectRolesValidation?.some((validation) => validation)) {
        return Result.fail(projectRolesValidation);
      }

      // Création
      const result = await this.projectRepository.create({
        ownerId: request.ownerId,
        title: request.title,
        image: request.image || '',
        description: request.description,
        categories: request.categories,
        techStacks: request.techStacks,
        projectRoles: request.projectRoles?.map((role) => ({
          title: role.title,
          description: role.description,
          techStacks: role.techStacks.map((id) => id),
        })),
      });

      if (!result.success) {
        return Result.fail('DATABASE_ERROR');
      }

      return Result.ok(result.value);
    } catch (error) {
      this.logger.error('Error creating project', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
}
```

### 5. Controller - Point d'Entrée HTTP

```typescript
// controllers/project.controller.ts
@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(
    @Session() session: UserSession,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const userId = session.user.id;
    const result = await this.projectService.createProject({
      ownerId: userId,
      title: createProjectDto.title,
      description: createProjectDto.description,
      categories: createProjectDto.categories,
      techStacks: createProjectDto.techStacks,
      projectRoles: createProjectDto.projectRoles || [],
    });

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }
}
```

### 6. DTO - Validation Transport

```typescript
// controllers/dto/create-project.dto.ts
export class CreateProjectDto {
  @ApiProperty({ description: 'Project title', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Full description', maxLength: 1000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Project categories' })
  @IsArray()
  @ArrayMinSize(1)
  categories: string[];

  @ApiProperty({ description: 'Project tech stacks' })
  @IsArray()
  @ArrayMinSize(1)
  techStacks: string[];

  @ApiProperty({ description: 'Project roles (optional)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectRoleDto)
  projectRoles?: ProjectRoleDto[];
}
```

### 7. Module - Configuration

```typescript
// project.module.ts
@Module({
  imports: [PrismaModule, TechStackModule, CategoryModule, ProjectRoleModule],
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_REPOSITORY,
      useClass: PrismaProjectRepository,
    },
    ProjectService,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
```

### 8. Tests - Couverture Complète

```typescript
// services/project.service.spec.ts
describe('ProjectService', () => {
  it('should create project with only required fields', async () => {
    const result = await service.createProject(validRequest);
    expect(result.success).toBe(true);
    expect(mockProjectRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Project',
        ownerId: 'user123',
        // ...
      }),
    );
  });

  it('should fail if project title already exists', async () => {
    mockProjectRepository.findByTitle.mockResolvedValue({ success: true });
    const result = await service.createProject(validRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('DUPLICATE_PROJECT');
    }
  });
});
```

## Finalisation de better-auth

J'ai modifié quelques lignes de code et rajouté en suivant la documentation de https://github.com/ThallesP/nestjs-better-auth . J'ai rencontré des problèmes lors des premiers requêtes `HTTP POST`. Le body parser ne fonctionnait plus. Étant donné qu'il est désactivé, je pense que c'est le AuthModule.forRoot() qui le réactive. Donc j'ai suivi la documentation et ça a réglé le problème.

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@/auth/auth';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [PrismaModule, AuthModule.forRoot(auth), FeaturesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

J'ai aussi instancié le service prisma dans `auth.ts`:

```typescript
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import * as process from 'node:process';
import { PrismaService } from 'prisma/prisma.service';

const prisma = new PrismaService();

export const auth: {
  handler: (req: Request) => Promise<Response>;
} = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      bio: { type: 'string', required: false, input: false },
      login: { type: 'string', required: false, input: false },
      location: { type: 'string', required: false, input: false },
      company: { type: 'string', required: false, input: false },
    },
  },
  logger: {
    level: 'debug',
    transport: {
      type: 'console',
      options: {
        colorize: true,
        timestamp: true,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURL: 'http://localhost:4000/api/auth/callback/github',
      overrideUserInfoOnSignIn: true,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURL: 'http://localhost:4000/api/auth/callback/google',
    },
  },
  trustedOrigins: ['http://localhost:3000', 'http://localhost:4000'],
  baseURL: 'http://localhost:4000',
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
      cookieName: 'better-auth',
      cookieDomain: 'localhost',
    },
  },
});
```

## Points Clés de l'Implémentation

1. **Validation Séparée** : Validation transport (DTO) + validation métier (domain) + validation références (service)
2. **Result Pattern** : Gestion explicite des erreurs sans exceptions non contrôlées
3. **Dépendances Injectées** : Utilisation des tokens pour l'injection de dépendances
4. **Mapping Prisma → Domain** : Transformation des données de la base vers le domaine
5. **Tests Complets** : Couverture des cas de succès et d'erreur
6. **Documentation OpenAPI** : Décoration des DTOs avec `@ApiProperty`
7. **Gestion des Relations** : Création atomique avec `connect` et `create` Prisma

## Point d'amélioration

Mieux typer le retour des méthodes dans le service. N'hésitez pas si vous avez des solutions plus pertinentes. J'ai volontairement fait au plus simple pour gagner du temps et que tout le monde puisse commencer.
