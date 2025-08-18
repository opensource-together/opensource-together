import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TechStack } from '../domain/tech-stack';
import { TechStackRepository } from './tech-stack.repository.interface';

@Injectable()
export class PrismaTechStackRepository implements TechStackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIds(ids: string[]): Promise<TechStack[]> {
    try {
      const result = await this.prisma.techStack.findMany({
        where: { id: { in: ids } },
      });
      return result;
    } catch (error) {
      console.error('Error finding tech stacks by ids', error);
      throw error;
    }
  }
}
