import { TechstackRepositoryPort } from '@/application/teckstack/ports/teckstack.repository.port';
import { TechStack } from '@/domain/techStack/techstack.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructures/orm/prisma/prisma.service';
import { PrismaTechstackMapper } from './prisma.techstack.mapper';
import { Result } from '@/shared/result';
import { TechStack as PrismaTechStack } from '@prisma/client';

@Injectable()
export class PrismaTechstackRepository implements TechstackRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Result<TechStack[]>> {
    try {
      const techStackResult: PrismaTechStack[] =
        await this.prisma.techStack.findMany();
      if (!techStackResult) {
        return Result.ok([]);
      }
      const teckStack: TechStack[] = [];
      for (const techstack of techStackResult) {
        const result = PrismaTechstackMapper.toDomain(techstack);
        if (!result.success) {
          return Result.fail(result.error);
        }
        teckStack.push(result.value);
      }
      return Result.ok(teckStack);
    } catch (error) {
      console.error(error);
      return Result.fail('Une erreur est survernue');
    }
  }
}
