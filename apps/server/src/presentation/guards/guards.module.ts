import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { Module } from '@nestjs/common';
import { GithubAuthGuard } from './github-auth.guard';
import { EncryptionService } from '@/infrastructures/encryption/encryption.service';
import { EncryptionModule } from '@/infrastructures/encryption/encryption.module';

@Module({
  imports: [RepositoryModule, EncryptionModule],
  providers: [GithubAuthGuard, EncryptionService],
})
export class GuardsModule {}
