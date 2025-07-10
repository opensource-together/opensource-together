import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllCategoriesQuery } from '@/contexts/category/use-cases/queries/get-all-categories.query';
import { Category } from '@/contexts/category/domain/category.entity';
import { Result } from '@/libs/result';

@Controller('categories')
export class CategoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllCategories(): Promise<Category[] | { error: string }> {
    const result: Result<Category[], string> = await this.queryBus.execute(
      new GetAllCategoriesQuery(),
    );

    if (!result.success) {
      return { error: result.error };
    }

    return result.value;
  }
}
