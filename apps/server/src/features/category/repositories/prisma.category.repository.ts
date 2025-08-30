import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Category } from '../domain/category';
import { ICategoryRepository } from './category.repository.interface';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Result<Category[], string>> {
    try {
      const categories = await this.prisma.category.findMany();
      return Result.ok(categories);
    } catch (error) {
      console.error('Error fetching all categories', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
  async findByIds(ids: string[]): Promise<Result<Category[], string>> {
    try {
      const result = await this.prisma.category.findMany({
        where: { id: { in: ids } },
        orderBy: { name: 'asc' },
      });
      return Result.ok(result);
    } catch (error) {
      console.error('Error finding categories by ids', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
}
