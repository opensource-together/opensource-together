import { Category } from '../domain/category';
import { Result } from '@/libs/result';

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';

export interface CategoryRepository {
  findByIds(ids: string[]): Promise<Result<Category[], string>>;
}
