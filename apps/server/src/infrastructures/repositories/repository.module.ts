import { Module } from '@nestjs/common';
import { USER_REPOSITORY_PORT } from '@application/ports/user.repository.port';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';
import { PrismaUserRepository } from '@infrastructures/repositories/prisma.user.repository';
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
  ],
  imports: [],
  exports: [PrismaService, USER_REPOSITORY_PORT],
})
export class RepositoryModule {}
