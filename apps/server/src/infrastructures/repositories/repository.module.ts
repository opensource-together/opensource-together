import { Module } from '@nestjs/common';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';
import { PrismaUserRepository } from '@/infrastructures/repositories/user/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '@/application/user/ports/user.repository.port';
import { PrismaProjectRoleRepository } from './projectRoles/prisma.projectRole.repository';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/application/project/ports/projectRole.repository.port';
import { USER_GITHUB_CREDENTIALS_REPOSITORY_PORT } from '@/application/github/ports/user-github-credentials.repository.port';
import { PrismaUserGitHubCredentialsRepository } from '@/infrastructures/repositories/user/prisma.user-github-credentials';
import { TECHSTACK_REPOSITORY_PORT } from '@/application/teckstack/ports/teckstack.repository.port';
import { PrismaTechstackRepository } from '@/infrastructures/repositories/teckstack/prisma.techstack.repository';
import { PrismaProfileRepository } from '@/infrastructures/repositories/profile/prisma.profile.repository';
import { PROFILE_REPOSITORY_PORT } from '@/application/profile/ports/profile.repository.port';

@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: PROJECT_ROLE_REPOSITORY_PORT,
      useClass: PrismaProjectRoleRepository,
    },
    {
      provide: USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
      useClass: PrismaUserGitHubCredentialsRepository,
    },
    {
      provide: TECHSTACK_REPOSITORY_PORT,
      useClass: PrismaTechstackRepository,
    },
    {
      provide: PROFILE_REPOSITORY_PORT,
      useClass: PrismaProfileRepository,
    },
  ],
  imports: [],
  exports: [
    PrismaService,
    USER_REPOSITORY_PORT,
    USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
    TECHSTACK_REPOSITORY_PORT,
    PROFILE_REPOSITORY_PORT,
    PROJECT_ROLE_REPOSITORY_PORT,
  ],
})
export class RepositoryModule {}
