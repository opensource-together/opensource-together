import { Controller, Get } from '@nestjs/common';
import { Category } from '@/contexts/category/domain/category.entity';
import { PublicAccess } from 'supertokens-nestjs';
import { ApiTags } from '@nestjs/swagger';
import { CategoryRepositoryPort } from '../ports/category.repository.port';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryRepo: CategoryRepositoryPort) {}

  @PublicAccess()
  @Get()
  async getAllCategories(): Promise<Category[] | { error: string }> {
    const result = await this.categoryRepo.getAll();

    if (!result.success) {
      return { error: result.error };
    }

    return result.value;
  }
}
