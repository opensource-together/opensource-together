import { Module } from '@nestjs/common';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';
import { PrismaUserRepository } from '@/infrastructures/repositories/user/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '@/application/user/ports/user.repository.port';
import { PrismaProjectRoleRepository } from './projectRoles/prisma.projectRole.repository';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/application/project/ports/projectRole.repository.port';
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
  ],
  imports: [],
  exports: [PrismaService, USER_REPOSITORY_PORT, PROJECT_ROLE_REPOSITORY_PORT],
})
export class RepositoryModule {}
