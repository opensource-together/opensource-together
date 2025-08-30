import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from '../domain/category';
import { CategoryService } from '../services/category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Return the list of all categories available for projects',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all categories available',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Développement Web' },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Server error when fetching categories',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
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
