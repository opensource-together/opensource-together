import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/application/project/ports/project.repository.port';
import { PrismaProjectRepository } from '@infrastructures/repositories/prisma.project.repository';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { CreateProjectCommand } from '@/application/project/commands/create-project.usecase';
import { FindProjectByTitleHandler } from '@/application/project/queries/find-by-title/find-project-by-title.handler';
import { FindProjectByIdHandler } from '@/application/project/queries/find-by-id/find-project-by-id.handler';
import { GetProjectsHandler } from '@/application/project/queries/get-all/get-projects.handler';
@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
    CreateProjectCommand,
    FindProjectByTitleHandler,
    FindProjectByIdHandler,
    GetProjectsHandler,
  ],
  exports: [],
})
export class ProjectWiringModule {}
