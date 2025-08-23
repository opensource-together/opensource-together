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

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule],

  controllers: [GithubController],
  providers: [
    OctokitProvider,
    GitHubStatsService,
    {
      provide: GITHUB_REPOSITORY,
      useClass: GithubRepository,
    },
  ],
  exports: [
    GITHUB_REPOSITORY,
    OctokitProvider,
    GitHubStatsService,
  ],
})
export class GithubInfrastructure {}
