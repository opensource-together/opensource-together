import { Module } from '@nestjs/common';
import { GithubUserController } from './github-user.controller';
import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { EncryptionModule } from '@/infrastructures/encryption/encryption.module';

@Module({
  imports: [RepositoryModule, EncryptionModule],
  controllers: [GithubUserController],
})
export class GithubUserModule {}
