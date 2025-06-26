import { Module } from '@nestjs/common';
import { profileUseCases } from '@/contexts/profile/use-cases/profile.use-cases';
import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { ProfileController } from './controllers/profile.controller';
import { PrismaProfileRepository } from './repositories/prisma.profile.repository';
import { PROFILE_REPOSITORY_PORT } from '../use-cases/ports/profile.repository.port';

@Module({
  imports: [RepositoryModule],
  providers: [
    ...profileUseCases,
    {
      provide: PROFILE_REPOSITORY_PORT,
      useClass: PrismaProfileRepository,
    },
  ],
  controllers: [ProfileController],
})
export class ProfileInfrastructure {}
