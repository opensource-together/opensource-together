import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/application/project/ports/project.repository.port';
import { PrismaProjectRepository } from '@/infrastructures/repositories/project/prisma.project.repository';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { projectCommandsContainer } from '@/application/project/commands/project.command';
import { projectQueriesContainer } from '@/application/project/queries/project.queries';
@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
    ...projectCommandsContainer,
    ...projectQueriesContainer,
  ],
  exports: [],
})
export class ProjectWiringModule {}
