import { Module } from '@nestjs/common';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';
import { PrismaUserRepository } from '@/infrastructures/repositories/user/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '@/application/user/ports/user.repository.port';
import { USER_GITHUB_CREDENTIALS_REPOSITORY_PORT } from '@/application/user/ports/user-github-credentials.repository';
import { PrismaUserGitHubCredentialsRepository } from '@/infrastructures/repositories/user/prisma.user-github-credentials';
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
      useClass: PrismaUserGitHubCredentialsRepository,
    },
  ],
  imports: [],
  exports: [
    PrismaService,
    USER_REPOSITORY_PORT,
    USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
  ],
})
export class RepositoryModule {}
