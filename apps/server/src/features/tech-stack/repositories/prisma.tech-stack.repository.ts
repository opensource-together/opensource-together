import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TechStack } from '../domain/tech-stack';
import { ITechStackRepository } from './tech-stack.repository.interface';

@Injectable()
export class PrismaTechStackRepository implements ITechStackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Result<TechStack[], string>> {
    try {
      const techStacks = await this.prisma.techStack.findMany();
      return Result.ok(techStacks);
    } catch (error) {
      console.error('Error fetching all tech stacks', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
  async findByIds(ids: string[]): Promise<Result<TechStack[], string>> {
    try {
      const result = await this.prisma.techStack.findMany({
        where: { id: { in: ids } },
      });
      return Result.ok(result);
    } catch (error) {
      console.error('Error finding tech stacks by ids', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
}
