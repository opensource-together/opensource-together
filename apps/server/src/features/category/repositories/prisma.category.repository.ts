import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryRepository } from './category.repository.interface';
import { Category } from '../domain/category';
import { Result } from '@/libs/result';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIds(ids: string[]): Promise<Result<Category[], string>> {
    try {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: ids } },
      });
      return Result.ok(categories);
    } catch (error) {
      console.error('Error finding categories by ids', error);
      return Result.fail('Error finding categories by ids');
    }
  }
}
