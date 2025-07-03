import { Injectable } from '@nestjs/common';
import { TechStackRepositoryPort } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { Result } from '@/shared/result';

@Injectable()
export class PrismaTechStackRepository implements TechStackRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByIds(ids: string[]): Promise<Result<TechStack[], string>> {
    const techStacks = await this.prisma.techStack.findMany({
      where: { id: { in: ids } },
    });
    const domainTechStacks = techStacks.map((techStack) =>
      TechStack.reconstitute(techStack),
    );
    const failedTechStacks = domainTechStacks.filter(
      (domainTechStack) => !domainTechStack.success,
    );
    if (failedTechStacks.length > 0)
      return Result.fail(failedTechStacks[0].error as string);
    const successTechStacks = domainTechStacks.filter(
      (domainTechStack) => domainTechStack.success,
    );
    return Result.ok(
      successTechStacks.map((domainTechStack) => domainTechStack.value),
    );
  }
}
