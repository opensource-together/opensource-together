import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryRepository } from './category.repository.interface';
import { Category } from '../domain/category';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIds(ids: string[]): Promise<Category[]> {
    return this.prisma.category.findMany({ where: { id: { in: ids } } });
  }
}
