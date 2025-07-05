import { Module } from '@nestjs/common';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { PrismaProjectRoleRepository } from '@/contexts/project-role/infrastructure/repositories/prisma.project-role.repository';
import { projectRoleUseCases } from '@/contexts/project-role/use-cases/project-role.use-cases';
import { ProjectRolesController } from '@/contexts/project-role/infrastructure/controllers/project-roles.controller';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { PrismaTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/prisma.techstack.repository';
import { PrismaProjectRepository } from '@/contexts/project/infrastructure/repositories/prisma.project.repository';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { InMemoryTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/mock.techstack.repository';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { InMemoryProjectRoleRepository } from '@/contexts/project-role/infrastructure/repositories/mock.project-role.repository';

@Module({
  providers: [
    PrismaService,
    ...projectRoleUseCases,
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
  ],
  controllers: [ProjectRolesController],
  exports: [PROJECT_ROLE_REPOSITORY_PORT],
})
export class ProjectRoleInfrastructure {}
