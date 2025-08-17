import { Module } from '@nestjs/common';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { projectRoleApplicationUseCases } from '../../project/bounded-contexts/project-role-application/use-cases/project-role-application.use-cases';
import { PROJECT_ROLE_APPLICATION_REPOSITORY_PORT } from '../../project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { PrismaProjectRoleApplicationRepository } from '../../project/bounded-contexts/project-role-application/infrastructure/repositories/prisma.project-role-application.repository';
import { PROJECT_ROLE_REPOSITORY_PORT } from '../../project/bounded-contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaProjectRoleRepository } from '../../project/bounded-contexts/project-role/infrastructure/repositories/prisma.project-role.repository';
import { PROJECT_REPOSITORY_PORT } from '../../project/use-cases/ports/project.repository.port';
import { PrismaProjectRepository } from '../../project/infrastructure/repositories/prisma.project.repository';
import { ApplicationController } from './controllers/application.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TeamMemberInfrastructure } from '../../project/bounded-contexts/team-member/infrastructure/team-member.infrastructure';
import { MAILING_SERVICE_PORT } from '@/mailing/ports/mailing.service.port';
import { ResendMailingService } from '@/mailing/infrastructure/resend.mailing.service';
import { USER_REPOSITORY_PORT } from '@/contexts/user/use-cases/ports/user.repository.port';
import { PrismaUserRepository } from '@/contexts/user/infrastructure/repositories/prisma.user.repository';

@Module({
  imports: [PersistenceInfrastructure, CqrsModule, TeamMemberInfrastructure],
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
  controllers: [ApplicationController],
})
export class ApplicationInfrastructure {}
