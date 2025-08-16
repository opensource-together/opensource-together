import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
//import { PROFILE_REPOSITORY_PORT } from './ports/profile.repository.port';
//import { PrismaProfileRepository } from './repositories/prisma.profile.repository';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { USER_REPOSITORY_PORT } from '@/contexts/user/use-cases/ports/user.repository.port';
import { PrismaUserRepository } from '@/contexts/user/infrastructure/repositories/prisma.user.repository';
import { TechStackInfrastructure } from '@/contexts/techstack/infrastructure/techstack.infrastructure';

@Module({
  imports: [CqrsModule, PersistenceInfrastructure, TechStackInfrastructure],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    /*{
      provide: PROFILE_REPOSITORY_PORT,
      useClass: PrismaProfileRepository,
    },*/
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [ProfileService],
})
export class ProfileInfrastructure {}
