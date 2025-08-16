import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import {
  TECHSTACK_REPOSITORY_PORT,
  TechStackRepositoryPort,
} from '../ports/techstack.repository.port';

export class GetAllTechStacksQuery implements IQuery {}

@QueryHandler(GetAllTechStacksQuery)
export class GetAllTechStacksQueryHandler
  implements IQueryHandler<GetAllTechStacksQuery>
{
  constructor(
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepo: TechStackRepositoryPort,
  ) {}

  async execute(): Promise<Result<TechStack[], string>> {
    return await this.techStackRepo.getAll();
  }
}
