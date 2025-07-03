import { Result } from '@/shared/result';
import { TechStackPrimitive } from '@/contexts/techstack/domain/techstack.entity';

export const PROJECT_VALIDATION_SERVICE_PORT = Symbol(
  'ProjectValidationService',
);

export interface ProjectValidationServicePort {
  validateTechStacksExistence(
    techStacks: TechStackPrimitive[],
  ): Promise<Result<void, string>>;

  validateProjectTitleUniqueness(title: string): Promise<Result<void, string>>;
}
