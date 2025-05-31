import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OctokitProvider } from './providers/octokit.provider';
import { GithubRepositoryAdapter } from './adapters/github-repository.adapter';

@Module({
  imports: [ConfigModule],
  providers: [OctokitProvider],
  exports: [GithubRepositoryAdapter],
})
export class GithubModule {}
