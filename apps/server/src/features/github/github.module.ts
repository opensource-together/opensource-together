import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OctokitProvider } from './repositories/octokit.provider';
import { GithubController } from './controllers/github.controller';
import { GitHubStatsService } from './services/github-stats.service';
import { PrismaModule } from 'prisma/prisma.module';
import { 
  GITHUB_REPOSITORY,
} from './repositories/github.repository.interface';
import { GithubRepository } from './repositories/github.repository';
import { ACCOUNT_REPOSITORY } from './repositories/account.repository.interface';
import { AccountRepository } from './repositories/account.repository';

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule],

  controllers: [GithubController],
  providers: [
    OctokitProvider,
    GitHubStatsService,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountRepository
    },
    {
      provide: GITHUB_REPOSITORY,
      useClass: GithubRepository,
    },
  ],
  exports: [
    ACCOUNT_REPOSITORY,
    GITHUB_REPOSITORY,
    OctokitProvider,
    GitHubStatsService,
  ],
})
export class GithubModule {}
