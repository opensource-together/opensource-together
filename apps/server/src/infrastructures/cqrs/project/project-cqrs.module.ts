import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@application/ports/project.repository.port';
import { PrismaProjectRepository } from '@infrastructures/repositories/prisma.project.repository';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { projectUsecaseHandlersContainer } from './use-case-handlers/project-usecase.handlers';
import { projectHandlerContainer } from './queries/project.handlers';

@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
    ...projectHandlerContainer,
    ...projectUsecaseHandlersContainer,
  ],
  exports: [],
})
export class ProjectCqrsModule {}
