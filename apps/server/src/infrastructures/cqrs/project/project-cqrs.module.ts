import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@application/ports/project.repository.port';
import { PrismaProjectRepository } from '@infrastructures/repositories/prisma.project.repository';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { CreateProjectHandler } from './use-case-handlers/create-project.handler';
import { findTitleHandler } from './queries/find-title.handler';
@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
    CreateProjectHandler,
    findTitleHandler,
  ],
  exports: [],
})
export class ProjectCqrsModule {}
