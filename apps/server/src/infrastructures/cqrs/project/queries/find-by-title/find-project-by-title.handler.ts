import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindProjectByTitleQuery } from './find-project-by-title.query';
import { Inject } from '@nestjs/common';
import { Project } from '@/domain/project/project.entity';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/application/ports/project.repository.port';
import { Result } from '@/shared/result';
@QueryHandler(FindProjectByTitleQuery)
export class FindProjectByTitleHandler
  implements IQueryHandler<FindProjectByTitleQuery>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(
    query: FindProjectByTitleQuery,
  ): Promise<Result<Project[] | null>> {
    const projects = await this.projectRepo.findProjectByTitle(query.title);
    if (projects.success) {
      return Result.ok(projects.value);
    }
    return Result.fail(projects.error);
  }
}
