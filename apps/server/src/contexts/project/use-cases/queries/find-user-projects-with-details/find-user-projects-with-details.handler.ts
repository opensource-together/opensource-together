import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectRepositoryPort } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Result } from '@/libs/result';
import { IQuery } from '@nestjs/cqrs';
import { ProjectWithDetails } from '@/contexts/project/infrastructure/repositories/prisma.project.mapper';

export class FindUserProjectsWithDetailsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FindUserProjectsWithDetailsQuery)
export class FindUserProjectsWithDetailsHandler
  implements IQueryHandler<FindUserProjectsWithDetailsQuery>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(
    query: FindUserProjectsWithDetailsQuery,
  ): Promise<Result<ProjectWithDetails[], string>> {
    const result = await this.projectRepo.findUserProjectsWithDetails(
      query.userId,
    );
    if (result.success) {
      return Result.ok(result.value);
    }
    return Result.fail(result.error);
  }
}
