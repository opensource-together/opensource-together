import { CategoryRepositoryPort } from '@/contexts/category/use-cases/ports/category.repository.port';
import { Category } from '../../domain/category.entity';
import { Result } from '@/libs/result';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Result<Category[], string>> {
    try {
      const categories = await this.prisma.category.findMany();
      const result = Category.reconstituteMany(
        categories.map((c) => ({ id: c.id, name: c.name })),
      );
      if (!result.success) {
        return Result.fail(result.error);
      }
      return Result.ok(result.value);
    } catch (error) {
      console.log('error', error);
      return Result.fail('Error fetching all categories');
    }
  }
  async findById(id: string): Promise<Result<Category, string>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        return Result.fail('Category not found');
      }
      const result = Category.reconstitute({ id, name: category.name });
      if (!result.success) {
        return Result.fail(result.error);
      }
      return Result.ok(result.value);
    } catch (error) {
      return Result.fail(error as string);
    }
  }

  async findByIds(ids: string[]): Promise<Result<Category[], string>> {
    try {
      console.log('ids', ids);
      const categories = await this.prisma.category.findMany({
        where: { id: { in: ids } },
      });
      console.log('categories', categories);
      if (!categories) {
        return Result.fail('Categories not found');
      }
      const result = Category.reconstituteMany(
        categories.map((c) => ({ id: c.id, name: c.name })),
      );
      if (!result.success) {
        return Result.fail(result.error);
      }
      return Result.ok(result.value);
    } catch (error) {
      console.log('error', error);
      return Result.fail('Error finding categories by ids');
    }
  }
}
