import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OctokitProvider } from './repositories/octokit.provider';
import { GithubController } from './controllers/github.controller';
import { GitHubStatsService } from './services/github-stats.service';
import { PrismaModule } from 'prisma/prisma.module';
import { 
  USER_GITHUB_CREDENTIALS_REPOSITORY,
} from './repositories/user-github-credentials.repository.interface';
import { 
  GITHUB_REPOSITORY,
} from './repositories/github.repository.interface';
import { GithubRepository } from './repositories/github.repository';
import { PrismaUserGitHubCredentialsRepository } from './repositories/prisma.user-github-credentials.repository';

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule],

  controllers: [GithubController],
  providers: [
    OctokitProvider,
    GitHubStatsService,
    {
      provide: USER_GITHUB_CREDENTIALS_REPOSITORY,
      useClass: PrismaUserGitHubCredentialsRepository,
    },
    {
      provide: GITHUB_REPOSITORY,
      useClass: GithubRepository,
    },
  ],
  exports: [
    GITHUB_REPOSITORY,
    USER_GITHUB_CREDENTIALS_REPOSITORY,
    OctokitProvider,
    GitHubStatsService,
  ],
})
export class GithubInfrastructure {}
