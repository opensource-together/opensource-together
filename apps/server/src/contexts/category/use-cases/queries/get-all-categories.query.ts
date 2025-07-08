import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import { Category } from '@/contexts/category/domain/category.entity';
import {
  CATEGORY_REPOSITORY_PORT,
  CategoryRepositoryPort,
} from '../ports/category.repository.port';

export class GetAllCategoriesQuery implements IQuery {}

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesQueryHandler
  implements IQueryHandler<GetAllCategoriesQuery>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY_PORT)
    private readonly categoryRepo: CategoryRepositoryPort,
  ) {}

  async execute(): Promise<Result<Category[], string>> {
    return await this.categoryRepo.getAll();
  }
}
