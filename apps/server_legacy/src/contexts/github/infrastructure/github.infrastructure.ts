import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// import { GITHUB_API_SERVICE_PORT } from '@/contexts/github/use-cases/ports/github-api.service.port';
// import { GitHubApiService } from '@/infrastructures/api/github-api.service';
import { githubUseCases } from '@/contexts/github/use-cases/github.use-cases';
// import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { ENCRYPTION_SERVICE_PORT } from '@/contexts/encryption/ports/encryption.service.port';
import { EncryptionService } from '@/contexts/encryption/infrastructure/encryption.service';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { ConfigModule } from '@nestjs/config';
import { OctokitProvider } from './providers/octokit.provider';
import { GithubRepository } from './repositories/github.repository';
import { GITHUB_REPOSITORY_PORT } from '../use-cases/ports/github-repository.port';
import {
  USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
  // UserGitHubCredentialsRepositoryPort,
} from '../use-cases/ports/user-github-credentials.repository.port';
import { PrismaUserGitHubCredentialsRepository } from './repositories/prisma.user-github-credentials.repository';
import { GithubController } from './controllers/github.controller';
import { GitHubStatsService } from './services/github-stats.service';

@Module({
  imports: [HttpModule, ConfigModule, PersistenceInfrastructure],

  controllers: [GithubController],
  providers: [
    ...githubUseCases,
    OctokitProvider,
    GitHubStatsService,
    {
      provide: USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
      useClass: PrismaUserGitHubCredentialsRepository,
    },
    {
      provide: GITHUB_REPOSITORY_PORT,
      useClass: GithubRepository,
    },
    {
      provide: ENCRYPTION_SERVICE_PORT,
      useClass: EncryptionService,
    },
  ],
  exports: [
    GITHUB_REPOSITORY_PORT,
    USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
    OctokitProvider,
    GitHubStatsService,
  ],
})
export class GithubInfrastructure {}
