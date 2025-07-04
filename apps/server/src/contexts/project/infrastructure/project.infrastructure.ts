import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { projectUseCases } from '@/contexts/project/use-cases/project.use-cases';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaProjectRepository } from '@/contexts/project/infrastructure/repositories/prisma.project.repository';
import { PrismaProjectRoleRepository } from '@/contexts/project-role/infrastructure/repositories/prisma.project-role.repository';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { PrismaTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/prisma.techstack.repository';
import { ProjectController } from '@/contexts/project/infrastructure/controllers/project.controller';
import { GithubRepository } from '@/contexts/github/infrastructure/repositories/github.repository';
import { GITHUB_REPOSITORY_PORT } from '@/contexts/github/use-cases/ports/github-repository.port';
// import { GithubAuthGuard } from '@/contexts/github/infrastructure/guards/github-auth.guard';
// import { OctokitProvider } from '@/contexts/github/infrastructure/providers/octokit.provider';
import { GithubInfrastructure } from '@/contexts/github/infrastructure/github.infrastructure';
import { USER_GITHUB_CREDENTIALS_REPOSITORY_PORT } from '@/contexts/github/use-cases/ports/user-github-credentials.repository.port';
import { PrismaUserGitHubCredentialsRepository } from '@/contexts/github/infrastructure/repositories/prisma.user-github-credentials.repository';
import { ENCRYPTION_SERVICE_PORT } from '@/application/encryption/ports/encryption.service.port';
import { EncryptionService } from '@/infrastructures/encryption/encryption.service';

@Module({
  imports: [],
  providers: [
    PrismaService,
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
    GithubInfrastructure,
    ...projectUseCases,
  ],
  controllers: [ProjectController],
  exports: [
    ...projectUseCases,
    // OctokitProvider
  ],
})
export class ProjectInfrastructure {}
