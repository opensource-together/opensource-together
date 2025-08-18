import { Module } from '@nestjs/common';
import { PrismaTechStackRepository } from './repositories/prisma.tech-stack.repository';
import { TECH_STACK_REPOSITORY } from './repositories/tech-stack.repository.interface';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: TECH_STACK_REPOSITORY, useClass: PrismaTechStackRepository },
  ],
  exports: [TECH_STACK_REPOSITORY],
})
export class TechStackModule {}
