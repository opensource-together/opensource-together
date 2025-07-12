import { Module } from '@nestjs/common';
import { TECHSTACK_REPOSITORY_PORT } from '../use-cases/ports/techstack.repository.port';
import { InMemoryTechStackRepository } from './repositories/mock.techstack.repository';
import { PrismaTechStackRepository } from './repositories/prisma.techstack.repository';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { techStackUseCases } from '../use-cases/techstack.use-cases';
import { TechStackController } from './controllers/techstack.controller';

@Module({
  providers: [
    PrismaService,
    {
      provide: TECHSTACK_REPOSITORY_PORT,
      useClass:
        process.env.NODE_ENV === 'test'
          ? InMemoryTechStackRepository
          : PrismaTechStackRepository,
    },
    ...techStackUseCases,
  ],
  controllers: [TechStackController],
  exports: [TECHSTACK_REPOSITORY_PORT],
})
export class TechStackInfrastructure {}
