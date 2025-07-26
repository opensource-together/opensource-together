import { Module } from '@nestjs/common';
import { profileUseCases } from '@/contexts/profile/use-cases/profile.use-cases';
import { ProfileController } from './controllers/profile.controller';
import { PrismaProfileRepository } from './repositories/prisma.profile.repository';
import { PROFILE_REPOSITORY_PORT } from '../use-cases/ports/profile.repository.port';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { USER_REPOSITORY_PORT } from '@/contexts/user/use-cases/ports/user.repository.port';
import { PrismaUserRepository } from '@/contexts/user/infrastructure/repositories/prisma.user.repository';
import { TechStackInfrastructure } from '@/contexts/techstack/infrastructure/techstack.infrastructure';

@Module({
  imports: [PersistenceInfrastructure, TechStackInfrastructure],
  providers: [
    ...profileUseCases,
    {
      provide: PROFILE_REPOSITORY_PORT,
      useClass: PrismaProfileRepository,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [ProfileController],
  exports: [...profileUseCases, PROFILE_REPOSITORY_PORT],
})
export class ProfileInfrastructure {}
