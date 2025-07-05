import { Module } from '@nestjs/common';
import { userUseCases } from '../use-cases/user.use-cases';
import { UserController } from './controllers/user.controller';
import { PrismaUserRepository } from './repositories/prisma.user.repository';
import { USER_REPOSITORY_PORT } from '../use-cases/ports/user.repository.port';
import { PrismaService } from '@/orm/prisma/prisma.service';
@Module({
  imports: [],
  providers: [
    PrismaService,
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
