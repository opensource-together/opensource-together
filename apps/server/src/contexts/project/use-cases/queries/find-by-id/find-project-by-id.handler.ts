import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectRepositoryPort } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import { Result } from '@/shared/result';
import { IQuery } from '@nestjs/cqrs';

export class FindProjectByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(FindProjectByIdQuery)
export class FindProjectByIdHandler
  implements IQueryHandler<FindProjectByIdQuery>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(query: FindProjectByIdQuery): Promise<Result<Project | null>> {
    const result = await this.projectRepo.findProjectById(query.id);
    if (result.success) {
      return Result.ok(result.value);
    }
    return Result.fail(result.error);
  }
}
