import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { OctokitProvider } from '@/infrastructures/github/providers/octokit.provider';
import { GithubRepositoryAdapter } from '@/infrastructures/github/adapters/github-repository.adapter';
import { GithubAuthGuard } from '../guards/github-auth.guard';
import { GuardsModule } from '../guards/guards.module';
import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { EncryptionModule } from '@/infrastructures/encryption/encryption.module';
import { GithubUserModule } from './user/github-user.module';
import { GithubRepositoryModule } from './repository/github-repository.module';

@Module({
  imports: [
    GuardsModule,
    RepositoryModule,
    EncryptionModule,
    GithubUserModule,
    GithubRepositoryModule,
  ],
  controllers: [GithubController],
  providers: [OctokitProvider, GithubRepositoryAdapter, GithubAuthGuard],
})
export class GithubModule {}
