import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GITHUB_API_SERVICE_PORT } from '@/application/github/ports/github-api.service.port';
import { GitHubApiService } from '@/infrastructures/api/github-api.service';
import { githubApplicationContainer } from '@/application/github/github.application';
// import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { ENCRYPTION_SERVICE_PORT } from '@/application/encryption/ports/encryption.service.port';
import { EncryptionService } from '@/infrastructures/encryption/encryption.service';
import { PrismaService } from '@/orm/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [
    PrismaService,
    ...githubApplicationContainer,
    {
      provide: GITHUB_API_SERVICE_PORT,
      useClass: GitHubApiService,
    },
    {
      provide: ENCRYPTION_SERVICE_PORT,
      useClass: EncryptionService,
    },
  ],
  exports: [GITHUB_API_SERVICE_PORT],
})
export class GitHubApiWiringModule {}
