import { Module } from '@nestjs/common';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project/bounded-contexts/project-role/use-cases/ports/project-role.repository.port';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { PrismaProjectRoleRepository } from '@/contexts/project/bounded-contexts/project-role/infrastructure/repositories/prisma.project-role.repository';
import { projectRoleUseCases } from '@/contexts/project/bounded-contexts/project-role/use-cases/project-role.use-cases';
import { ProjectRolesController } from '@/contexts/project/bounded-contexts/project-role/infrastructure/controllers/project-roles.controller';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { PrismaTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/prisma.techstack.repository';
import { PrismaProjectRepository } from '@/contexts/project/infrastructure/repositories/prisma.project.repository';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { InMemoryTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/mock.techstack.repository';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { InMemoryProjectRoleRepository } from '@/contexts/project/bounded-contexts/project-role/infrastructure/repositories/mock.project-role.repository';
import { projectRoleApplicationUseCases } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/project-role-application.use-cases';
import { PROJECT_ROLE_APPLICATION_REPOSITORY_PORT } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { PrismaProjectRoleApplicationRepository } from '@/contexts/project/bounded-contexts/project-role-application/infrastructure/repositories/prisma.project-role-application.repository';
import { USER_REPOSITORY_PORT } from '@/contexts/user/use-cases/ports/user.repository.port';
import { PrismaUserRepository } from '@/contexts/user/infrastructure/repositories/prisma.user.repository';

@Module({
  imports: [PersistenceInfrastructure],
  providers: [
    ...projectRoleUseCases,
    ...projectRoleApplicationUseCases,
    {
      provide: TECHSTACK_REPOSITORY_PORT,
      useClass:
        process.env.NODE_ENV === 'test'
          ? InMemoryTechStackRepository
          : PrismaTechStackRepository,
    },
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass:
        process.env.NODE_ENV === 'test'
          ? InMemoryProjectRepository
          : PrismaProjectRepository,
    },
    {
      provide: PROJECT_ROLE_REPOSITORY_PORT,
      useClass:
        process.env.NODE_ENV === 'test'
          ? InMemoryProjectRoleRepository
          : PrismaProjectRoleRepository,
    },
    {
      provide: PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
      useClass: PrismaProjectRoleApplicationRepository,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [ProjectRolesController],
  exports: [PROJECT_ROLE_REPOSITORY_PORT],
})
export class ProjectRoleInfrastructure {}
