import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@application/ports/project.repository.port';
import { PrismaProjectRepository } from '@infrastructures/repositories/prisma.project.repository';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { CreateProjectHandler } from './use-case-handlers/create-project.handler';
import { findProjectByTitleHandler } from './queries/find-project-by-title.handler';
import { FindProjectByIdHandler } from './queries/find-project-by-id.handler';
import { GetProjectsHandler } from './queries/get-projects.handler';
@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
    CreateProjectHandler,
    findProjectByTitleHandler,
    FindProjectByIdHandler,
    GetProjectsHandler,
  ],
  exports: [],
})
export class ProjectCqrsModule {}
