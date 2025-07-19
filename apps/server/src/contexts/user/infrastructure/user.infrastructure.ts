import { Module } from '@nestjs/common';
import { userUseCases } from '../use-cases/user.use-cases';
import { UserController } from './controllers/user.controller';
import { PrismaUserRepository } from './repositories/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '../use-cases/ports/user.repository.port';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
@Module({
  imports: [PersistenceInfrastructure],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    ...userUseCases,
  ],
  controllers: [UserController],
  exports: [...userUseCases],
})
export class UserInfrastructure {}
