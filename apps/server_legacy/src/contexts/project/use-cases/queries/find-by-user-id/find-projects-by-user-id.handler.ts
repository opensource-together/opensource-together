import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectRepositoryPort } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { Result } from '@/libs/result';
import { IQuery } from '@nestjs/cqrs';

export class FindProjectsByUserIdQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FindProjectsByUserIdQuery)
export class FindProjectsByUserIdHandler
  implements IQueryHandler<FindProjectsByUserIdQuery>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(
    query: FindProjectsByUserIdQuery,
  ): Promise<Result<Project[], string>> {
    const result = await this.projectRepo.findProjectsByUserId(query.userId);
    if (result.success) {
      return Result.ok(result.value);
    }
    return Result.fail(result.error);
  }
}
