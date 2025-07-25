import { Module } from '@nestjs/common';
import { userUseCases } from '../use-cases/user.use-cases';
import { UserController } from './controllers/user.controller';
import { PrismaUserRepository } from './repositories/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '../use-cases/ports/user.repository.port';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { PROJECT_ROLE_APPLICATION_REPOSITORY_PORT } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { PrismaProjectRoleApplicationRepository } from '@/contexts/project/bounded-contexts/project-role-application/infrastructure/repositories/prisma.project-role-application.repository';
@Module({
  imports: [PersistenceInfrastructure],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
      useClass: PrismaProjectRoleApplicationRepository,
    },
    ...userUseCases,
  ],
  controllers: [UserController],
  exports: [...userUseCases],
})
export class UserInfrastructure {}
