import { Result } from '@/libs/result';
import { Category } from '../domain/category';
import { Result } from '@/libs/result';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');


export interface ICategoryRepository {
  getAll(): Promise<Result<Category[], string>>;
  findByIds(ids: string[]): Promise<Result<Category[], string>>;
}
