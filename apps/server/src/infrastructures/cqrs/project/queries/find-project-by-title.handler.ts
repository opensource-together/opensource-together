import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { findProjectByTitleQuery } from './find-project-by-title.query';
import { Inject } from '@nestjs/common';
import { Project } from '@/domain/project/project.entity';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/application/ports/project.repository.port';

@QueryHandler(findProjectByTitleQuery)
export class findProjectByTitleHandler
  implements IQueryHandler<findProjectByTitleQuery>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(query: findProjectByTitleQuery): Promise<Project[] | null> {
    const projects = await this.projectRepo.findProjectByTitle(query.title);

    return projects;
  }
}
