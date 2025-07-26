import { Module } from '@nestjs/common';
import { PROJECT_ROLE_APPLICATION_REPOSITORY_PORT } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { PrismaProjectRoleApplicationRepository } from '@/contexts/project/bounded-contexts/project-role-application/infrastructure/repositories/prisma.project-role-application.repository';
import { projectRoleApplicationUseCases } from '../use-cases/project-role-application.use-cases';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project/bounded-contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaProjectRoleRepository } from '@/contexts/project/bounded-contexts/project-role/infrastructure/repositories/prisma.project-role.repository';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { PrismaProjectRepository } from '@/contexts/project/infrastructure/repositories/prisma.project.repository';
import { MAILING_SERVICE_PORT } from '@/mailing/ports/mailing.service.port';
import { ResendMailingService } from '@/mailing/infrastructure/resend.mailing.service';
import { USER_REPOSITORY_PORT } from '@/contexts/user/use-cases/ports/user.repository.port';
import { PrismaUserRepository } from '@/contexts/user/infrastructure/repositories/prisma.user.repository';
import { ProjectRoleApplicationController } from './controllers/project-role-application.controller';
import { UserProjectRoleApplicationController } from './controllers/user-project-role-application.controller';

@Module({
  imports: [PersistenceInfrastructure],
  providers: [
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
    {
      provide: MAILING_SERVICE_PORT,
      useClass: ResendMailingService,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [
    ProjectRoleApplicationController,
    UserProjectRoleApplicationController,
  ],
  exports: [
    PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
    PROJECT_ROLE_REPOSITORY_PORT,
    PROJECT_REPOSITORY_PORT,
  ],
})
export class ProjectRoleApplicationInfrastructure {}
