import { Module } from '@nestjs/common';
import { PROJECT_ROLE_APPLICATION_REPOSITORY_PORT } from '@/contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { PrismaProjectRoleApplicationRepository } from '@/contexts/project-role-application/infrastructure/repositories/prisma.project-role-application.repository';
import { projectRoleApplicationUseCases } from '../use-cases/project-role-application.use-cases';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaProjectRoleRepository } from '@/contexts/project-role/infrastructure/repositories/prisma.project-role.repository';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { PrismaProjectRepository } from '@/contexts/project/infrastructure/repositories/prisma.project.repository';

@Module({
  providers: [
    PrismaService,
    ...projectRoleApplicationUseCases,
    {
      provide: PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
      useClass: PrismaProjectRoleApplicationRepository,
    },
    {
      provide: PROJECT_ROLE_REPOSITORY_PORT,
      useClass: PrismaProjectRoleRepository,
    },
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
  ],
  exports: [
    PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
    PROJECT_ROLE_REPOSITORY_PORT,
    PROJECT_REPOSITORY_PORT,
  ],
})
export class ProjectRoleApplicationInfrastructure {}
