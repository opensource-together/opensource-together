import { Category } from '../domain/category';

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';

export interface CategoryRepository {
  findByIds(ids: string[]): Promise<Category[]>;
}
