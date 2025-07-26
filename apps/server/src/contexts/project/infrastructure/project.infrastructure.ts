import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { projectUseCases } from '@/contexts/project/use-cases/project.use-cases';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project/bounded-contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaProjectRepository } from '@/contexts/project/infrastructure/repositories/prisma.project.repository';
import { PrismaProjectRoleRepository } from '@/contexts/project/bounded-contexts/project-role/infrastructure/repositories/prisma.project-role.repository';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { PrismaTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/prisma.techstack.repository';
import { ProjectController } from '@/contexts/project/infrastructure/controllers/project.controller';
import { UserProjectController } from '@/contexts/project/infrastructure/controllers/user-project.controller';
import { ProjectKeyFeatureController } from '@/contexts/project/bounded-contexts/project-key-feature/infrastructure/controllers/project-key-feature.controller';
import { GithubRepository } from '@/contexts/github/infrastructure/repositories/github.repository';
import { GITHUB_REPOSITORY_PORT } from '@/contexts/github/use-cases/ports/github-repository.port';
import { GithubInfrastructure } from '@/contexts/github/infrastructure/github.infrastructure';
import { USER_GITHUB_CREDENTIALS_REPOSITORY_PORT } from '@/contexts/github/use-cases/ports/user-github-credentials.repository.port';
import { PrismaUserGitHubCredentialsRepository } from '@/contexts/github/infrastructure/repositories/prisma.user-github-credentials.repository';
import { ENCRYPTION_SERVICE_PORT } from '@/contexts/encryption/ports/encryption.service.port';
import { EncryptionService } from '@/contexts/encryption/infrastructure/encryption.service';
import { CATEGORY_REPOSITORY_PORT } from '@/contexts/category/use-cases/ports/category.repository.port';
import { PrismaCategoryRepository } from '@/contexts/category/infrastructure/repositories/prisma.category.repository';
import { PROFILE_REPOSITORY_PORT } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { PrismaProfileRepository } from '@/contexts/profile/infrastructure/repositories/prisma.profile.repository';
import { MEDIA_SERVICE_PORT } from '@/media/port/media.service.port';
import { R2MediaService } from '@/media/infrastructure/services/r2.media.service';
import { PROJECT_KEY_FEATURE_REPOSITORY_PORT } from '../bounded-contexts/project-key-feature/use-cases/ports/project-key-feature.repository.port';
import { PrismaProjectKeyFeatureRepository } from '../bounded-contexts/project-key-feature/infrastructure/repositories/prisma.project-key-feature.repository';

@Module({
  imports: [PersistenceInfrastructure],
  providers: [
    // PrismaService,
    // OctokitProvider,
    // GithubAuthGuard,
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
    {
      provide: TECHSTACK_REPOSITORY_PORT,
      useClass: PrismaTechStackRepository,
    },
    {
      provide: PROJECT_ROLE_REPOSITORY_PORT,
      useClass: PrismaProjectRoleRepository,
    },
    {
      provide: GITHUB_REPOSITORY_PORT,
      useClass: GithubRepository,
    },
    {
      provide: ENCRYPTION_SERVICE_PORT,
      useClass: EncryptionService,
    },
    {
      provide: USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
      useClass: PrismaUserGitHubCredentialsRepository,
    },
    {
      provide: CATEGORY_REPOSITORY_PORT,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: PROFILE_REPOSITORY_PORT,
      useClass: PrismaProfileRepository,
    },
    {
      provide: MEDIA_SERVICE_PORT,
      useClass: R2MediaService,
    },
    {
      provide: PROJECT_KEY_FEATURE_REPOSITORY_PORT,
      useClass: PrismaProjectKeyFeatureRepository,
    },
    GithubInfrastructure,
    ...projectUseCases,
  ],
  controllers: [ProjectController, UserProjectController, ProjectKeyFeatureController],
  exports: [
    ...projectUseCases,
    // OctokitProvider
  ],
})
export class ProjectInfrastructure {}
