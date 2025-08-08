import { Injectable } from '@nestjs/common';
import { TechStackRepositoryPort } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { Result } from '@/libs/result';

@Injectable()
export class PrismaTechStackRepository implements TechStackRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Result<TechStack[], string>> {
    try {
      const techStacks = await this.prisma.techStack.findMany();
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
    } catch (error) {
      return Result.fail(`Error fetching all tech stacks : ${error}`);
    }
  }

  async create(techStack: TechStack): Promise<Result<TechStack, string>> {
    try {
      const techStackCreated = await this.prisma.techStack.create({
        data: techStack.toPrimitive(),
      });
      const techStackReconstituted = TechStack.reconstitute(techStackCreated);
      if (!techStackReconstituted.success) {
        return Result.fail(techStackReconstituted.error as string);
      }
      return Result.ok(techStackReconstituted.value);
    } catch (error) {
      return Result.fail(`Could not create TechStack : ${error}`);
    }
  }

  async findByIds(ids: string[]): Promise<Result<TechStack[], string>> {
    try {
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
    } catch (error) {
      return Result.fail(`TechStacks not found : ${error}`);
    }
  }

  async delete(id: string): Promise<Result<boolean, string>> {
    try {
      await this.prisma.techStack.delete({ where: { id } });
      return Result.ok(true);
    } catch (error) {
      return Result.fail(error as string);
    }
  }
}
