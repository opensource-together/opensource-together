import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TechStackController } from './controllers/tech-stack.controller';
import { TechStackRepository } from './repositories/tech-stack.repository';
import { TECH_STACK_REPOSITORY } from './repositories/tech-stack.repository.interface';
import { TechStackService } from './services/tech-stack.service';

@Module({
  imports: [PrismaModule],
  controllers: [TechStackController],
  providers: [
    {
      provide: TECH_STACK_REPOSITORY,
      useClass: TechStackRepository,
    },
    TechStackService,
  ],
  exports: [TECH_STACK_REPOSITORY, TechStackService],
})
export class TechStackModule {}
