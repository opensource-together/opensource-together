import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { OctokitProvider } from '@/infrastructures/github/providers/octokit.provider';
import { GithubRepositoryAdapter } from '@/infrastructures/github/adapters/github-repository.adapter';

@Module({
  controllers: [GithubController],
  providers: [OctokitProvider, GithubRepositoryAdapter],
})
export class GithubModule {}
