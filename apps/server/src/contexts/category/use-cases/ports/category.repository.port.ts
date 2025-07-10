import { Category } from '@/contexts/category/domain/category.entity';
import { Result } from '@/libs/result';

export const CATEGORY_REPOSITORY_PORT = Symbol('CATEGORY_REPOSITORY_PORT');
export interface CategoryRepositoryPort {
  getAll(): Promise<Result<Category[], string>>;
  findById(id: string): Promise<Result<Category, string>>;
  findByIds(ids: string[]): Promise<Result<Category[], string>>;
}
