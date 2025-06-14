import { Module } from '@nestjs/common';
import { GithubRepositoryController } from './github-repository.controller';
import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { EncryptionModule } from '@/infrastructures/encryption/encryption.module';

@Module({
  imports: [RepositoryModule, EncryptionModule],
  controllers: [GithubRepositoryController],
})
export class GithubRepositoryModule {}
