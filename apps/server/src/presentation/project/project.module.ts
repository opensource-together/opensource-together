import { ProjectController } from './project.controller';
import { Module } from '@nestjs/common';
import { CreateProjectCommand } from '@/infrastructures/cqrs/project/use-case-handlers/create-project.command';
@Module({
  controllers: [ProjectController],
  providers: [CreateProjectCommand],
})
export class ProjectModule {}
