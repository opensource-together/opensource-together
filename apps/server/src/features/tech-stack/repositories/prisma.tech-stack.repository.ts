import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TechStack } from '../domain/tech-stack';
import { TechStackRepository } from './tech-stack.repository.interface';
import { Result } from '@/libs/result';

@Injectable()
export class PrismaTechStackRepository implements TechStackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIds(ids: string[]): Promise<Result<TechStack[], string>> {
    try {
      const result = await this.prisma.techStack.findMany({
        where: { id: { in: ids } },
      });
      return Result.ok(result);
    } catch (error) {
      console.error('Error finding tech stacks by ids', error);
      return Result.fail('DATABASE_ERROR' as string);
    }
  }
}
