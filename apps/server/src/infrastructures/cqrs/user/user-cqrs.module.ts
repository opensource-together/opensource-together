import { Module } from '@nestjs/common';
import { userHandlerContainer } from './queries/user.handlers';
import { userUsecaseHandlersContainer } from './use-case-handlers/user-usecase.handlers';
import { PrismaUserRepository } from '@infrastructures/repositories/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '@application/ports/user.repository.port';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    ...userHandlerContainer,
    ...userUsecaseHandlersContainer,
  ],
  exports: [],
})
export class UserCqrsModule {}
