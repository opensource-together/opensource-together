import { Module } from '@nestjs/common';
import { TECHSTACK_REPOSITORY_PORT } from '../use-cases/ports/techstack.repository.port';
import { InMemoryTechStackRepository } from './repositories/mock.techstack.repository';

@Module({
  providers: [
    {
      provide: TECHSTACK_REPOSITORY_PORT,
      useClass: InMemoryTechStackRepository,
    },
  ],
  exports: [TECHSTACK_REPOSITORY_PORT],
})
export class TechStackInfrastructure {}
