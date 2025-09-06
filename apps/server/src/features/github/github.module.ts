import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OctokitProvider } from './repositories/octokit.provider';
import { GithubController } from './controllers/github.controller';
import { GithubStatsService } from './services/github-stats.service';
import { PrismaModule } from 'prisma/prisma.module';
import { GITHUB_REPOSITORY } from './repositories/github.repository.interface';
import { GithubRepository } from './repositories/github.repository';
import { ACCOUNT_REPOSITORY } from './repositories/account.repository.interface';
import { AccountRepository } from './repositories/account.repository';
import { GithubRepositoryService } from './services/github-repository.service';
import { GithubUserService } from './services/github-user.service';
import { setGithubRepositoryService } from './services/github-repository.holder';
import { setGithubUserService } from './services/github-user.holder';
import { setGithubStatsService } from './services/github-stats.holder';

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule],

  controllers: [GithubController],
  providers: [
    OctokitProvider,
    GithubStatsService,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountRepository,
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
    GithubStatsService,
  ],
})
export class GithubModule implements OnModuleInit {
  constructor(
    private readonly githubRepositoryService: GithubRepositoryService,
    private readonly githubUserService: GithubUserService,
    private readonly githubStatsService: GithubStatsService,
  ) {}

  onModuleInit(): void {
    setGithubRepositoryService(this.githubRepositoryService);
    setGithubUserService(this.githubUserService);
    setGithubStatsService(this.githubStatsService);
  }
}
