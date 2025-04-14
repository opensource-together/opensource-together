import { ProjectController } from './project.controller';
import { Module } from '@nestjs/common';
import { CreateProjectHandler } from '@/infrastructures/cqrs/project/use-case-handlers/create-project.handler';
import { CreateProjectCommand } from '@/infrastructures/cqrs/project/use-case-handlers/create-project.command';
@Module({
  controllers: [ProjectController],
  providers: [CreateProjectCommand],
})
export class ProjectModule {}
