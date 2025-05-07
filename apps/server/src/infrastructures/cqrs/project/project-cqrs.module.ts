import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@application/ports/project.repository.port';
import { PrismaProjectRepository } from '@infrastructures/repositories/prisma.project.repository';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { CreateProjectHandler } from './commands/create-project/create-project.handler';
import { FindProjectByTitleHandler } from './queries/find-by-title/find-project-by-title.handler';
import { FindProjectByIdHandler } from './queries/find-by-id/find-project-by-id.handler';
import { GetProjectsHandler } from './queries/get-all/get-projects.handler';

@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
    CreateProjectHandler,
    FindProjectByTitleHandler,
    FindProjectByIdHandler,
    GetProjectsHandler,
  ],
  exports: [],
})
export class ProjectCqrsModule {}
