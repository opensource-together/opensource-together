import {
  Category,
  CategoryData,
} from '@/contexts/category/domain/category.entity';
import { CategoryRepositoryPort } from '@/contexts/category/use-cases/ports/category.repository.port';
import { Result } from '@/libs/result';

export class MockCategoryRepository implements CategoryRepositoryPort {
  private categories: CategoryData[] = [
    { id: '1', name: 'healthcare' },
    { id: '2', name: 'education' },
    { id: '3', name: 'technology' },
  ];
  async findById(id: string): Promise<Result<Category, string>> {
    try {
      const result = Category.reconstitute({
        id,
        name: this.categories.find((c) => c.id === id)?.name as string,
      });
      if (result.success) {
        return Promise.resolve(Result.ok(result.value));
      } else {
        return Promise.resolve(Result.fail(result.error));
      }
    } catch (error) {
      return Promise.resolve(Result.fail(error as string));
    }
  }

  async findByIds(ids: string[]): Promise<Result<Category[], string>> {
    try {
      const result = ids.map((id) =>
        Category.reconstitute({
          id,
          name: this.categories.find((c) => c.id === id)?.name as string,
        }),
      );
      if (result.every((r) => r.success)) {
        return Promise.resolve(Result.ok(result.map((r) => r.value)));
      } else {
        return Promise.resolve(Result.fail('Some categories are not valid'));
      }
    } catch (error) {
      return Promise.resolve(Result.fail(error as string));
    }
  }
}
