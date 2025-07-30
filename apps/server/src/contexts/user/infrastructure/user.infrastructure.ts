import { Module } from '@nestjs/common';
import { userUseCases } from '../use-cases/user.use-cases';
import { UserController } from './controllers/user.controller';
import { PrismaUserRepository } from './repositories/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '../use-cases/ports/user.repository.port';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { PROJECT_ROLE_APPLICATION_REPOSITORY_PORT } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { PrismaProjectRoleApplicationRepository } from '@/contexts/project/bounded-contexts/project-role-application/infrastructure/repositories/prisma.project-role-application.repository';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { PrismaTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/prisma.techstack.repository';
import { ProjectInfrastructure } from '@/contexts/project/infrastructure/project.infrastructure';
@Module({
  imports: [PersistenceInfrastructure, ProjectInfrastructure],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
      useClass: PrismaProjectRoleApplicationRepository,
    },
    {
      provide: TECHSTACK_REPOSITORY_PORT,
      useClass: PrismaTechStackRepository,
    },
    ...userUseCases,
  ],
  controllers: [UserController],
  exports: [...userUseCases],
})
export class UserInfrastructure {}
