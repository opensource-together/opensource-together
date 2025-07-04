import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/shared/result';
import { TechStackPrimitive } from '@/contexts/techstack/domain/techstack.entity';
import { ProjectValidationServicePort } from '@/contexts/project/use-cases/ports/project-validation.service.port';
import {
  TECHSTACK_REPOSITORY_PORT,
  TechStackRepositoryPort,
} from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';

@Injectable()
export class ProjectValidationService implements ProjectValidationServicePort {
  constructor(
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepo: TechStackRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async validateTechStacksExistence(
    techStacks: TechStackPrimitive[],
  ): Promise<Result<void, string>> {
    if (!techStacks || techStacks.length === 0) {
      return Result.fail('At least one tech stack is required');
    }

    // Extract IDs and filter out undefined/null values
    const techStackIds = techStacks
      .map((ts) => ts.id)
      .filter((id): id is string => id !== undefined && id !== null);

    if (techStackIds.length !== techStacks.length) {
      return Result.fail('All tech stacks must have valid IDs');
    }

    // Check existence in database
    const foundTechStacks = await this.techStackRepo.findByIds(techStackIds);
    if (!foundTechStacks.success) {
      return Result.fail('Error validating tech stacks');
    }

    if (foundTechStacks.value.length !== techStacks.length) {
      return Result.fail('Some tech stacks do not exist in our database');
    }

    return Result.ok(undefined);
  }

  async validateProjectTitleUniqueness(
    title: string,
  ): Promise<Result<void, string>> {
    const existingProject = await this.projectRepo.findByTitle(title);
    if (existingProject.success) {
      return Result.fail('Project with this title already exists');
    }
    return Result.ok(undefined);
  }
}
