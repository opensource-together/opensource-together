import { Module } from '@nestjs/common';
import { TECHSTACK_REPOSITORY_PORT } from '@/application/teckstack/ports/techstack.repository.port';
import { PrismaTechstackRepository } from '@/infrastructures/repositories/teckstack/prisma.techstack.repository';
import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { techStackApplicationContainer } from '@/application/teckstack/teckstack.application';
@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: TECHSTACK_REPOSITORY_PORT,
      useClass: PrismaTechstackRepository,
    },
    ...techStackApplicationContainer,
  ],
  exports: [TECHSTACK_REPOSITORY_PORT],
})
export class TechstackWiringModule {}
