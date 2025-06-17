import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TechstackRepositoryPort } from '@/application/teckstack/ports/teckstack.repository.port';
import { TechStack } from '@/domain/techStack/techstack.entity';
import { Inject } from '@nestjs/common';
import { TECHSTACK_REPOSITORY_PORT } from '@/application/teckstack/ports/teckstack.repository.port';
import { Result } from '@/shared/result';

export class GetTechstackListsQuery implements IQuery {}

@QueryHandler(GetTechstackListsQuery)
export class GetTechstackListsQueryHandler
  implements IQueryHandler<GetTechstackListsQuery>
{
  constructor(
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techstackRepo: TechstackRepositoryPort,
  ) {}

  async execute(): Promise<Result<TechStack[]>> {
    const result = await this.techstackRepo.getAll();
    if (result.success) {
      const techStacks = result.value.map((techStack) => techStack);
      return Result.ok(techStacks);
    }
    return Result.fail(result.error);
  }
}
