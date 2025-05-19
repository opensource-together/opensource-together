import { ProjectController } from './project.controller';
import { Module } from '@nestjs/common';
import { ProjectWiringModule } from '@/infrastructures/wiring/project/project-wiring.module';
@Module({
  imports: [ProjectWiringModule],
  controllers: [ProjectController],
})
export class ProjectModule {}
