import { Result } from '@/libs/result';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { TechStack } from '../domain/tech-stack';
import {
  ITechStackRepository,
  TECH_STACK_REPOSITORY,
} from '../repositories/tech-stack.repository.interface';

export interface TechStackResponse {
  languages: TechStack[];
  technologies: TechStack[];
}

@Injectable()
export class TechStackService {
  private readonly logger = new Logger(TechStackService.name);

  constructor(
    @Inject(TECH_STACK_REPOSITORY)
    private readonly techStackRepository: ITechStackRepository,
  ) {}

  async getAllTechStacks(): Promise<Result<TechStackResponse, string>> {
    try {
      const result = await this.techStackRepository.getAll();

      if (!result.success) {
        this.logger.error('Failed to fetch tech stacks from repository');
        return Result.fail(result.error);
      }

      const allTechStacks = result.value;

      const languages = allTechStacks.filter((ts) => ts.type === 'LANGUAGE');
      const technologies = allTechStacks.filter((ts) => ts.type === 'TECH');

      return Result.ok({
        languages,
        technologies,
      });
    } catch (error) {
      this.logger.error('Error in getAllTechStacks service', error);
      return Result.fail('INTERNAL_SERVER_ERROR');
    }
  }
}
