import { Result } from '@/libs/result';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Category } from '../domain/category';
import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from '../repositories/category.repository.interface';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async getAllCategories(): Promise<Result<Category[], string>> {
    try {
      const result = await this.categoryRepository.getAll();

      if (!result.success) {
        this.logger.error('Failed to fetch categories from repository');
        return Result.fail(result.error);
      }

      return Result.ok(result.value);
    } catch (error) {
      this.logger.error('Error in getAllCategories service', error);
      return Result.fail('INTERNAL_SERVER_ERROR');
    }
  }

  async findByIds(ids: string[]): Promise<Result<Category[], string>> {
    try {
      const result = await this.categoryRepository.findByIds(ids);

      if (!result.success) {
        this.logger.error('Failed to fetch categories by ids from repository');
        return Result.fail(result.error);
      }

      return Result.ok(result.value);
    } catch (error) {
      this.logger.error('Error in findByIds service', error);
      return Result.fail('INTERNAL_SERVER_ERROR');
    }
  }
}
