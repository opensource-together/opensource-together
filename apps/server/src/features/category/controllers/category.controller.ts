import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Category } from '../domain/category';
import { CategoryService } from '../services/category.service';
import { GetAllCategoriesDocs } from './docs/get-all-categories.swagger.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @GetAllCategoriesDocs()
  async getAllCategories(): Promise<Category[]> {
    const result = await this.categoryService.getAllCategories();
    if (!result.success) {
      throw new HttpException(
        'Failed to fetch categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result.value;
  }
}
