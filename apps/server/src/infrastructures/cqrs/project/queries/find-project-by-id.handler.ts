import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindProjectByIdQuery } from './find-project-by-id.query';
import { ProjectRepositoryPort } from '@/application/ports/project.repository.port';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/application/ports/project.repository.port';
import { Project } from '@/domain/project/project.entity';

@QueryHandler(FindProjectByIdQuery)
export class FindProjectByIdHandler
  implements IQueryHandler<FindProjectByIdQuery>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(query: FindProjectByIdQuery): Promise<Project | null> {
    return await this.projectRepo.findProjectById(query.id);
  }
}
