import { Result } from '@/shared/result';
import { TechStack } from './techstack.entity';

export class TechStackFactory {
  static create(id: string): Result<TechStack> {
    const techStack = new TechStack(id);
    return Result.ok(techStack);
  }

  static createMany(
    techStacksData: Array<{ id: string }>,
  ): Result<TechStack[]> {
    const techStacks: TechStack[] = [];
    const errors: string[] = [];

    techStacksData.map((techStack) => {
      const result = this.create(techStack.id);
      if (result.success) {
        techStacks.push(result.value);
      } else {
        errors.push(result.error);
      }
    });

    if (errors.length > 0) {
      return Result.fail(
        `Erreur lors de la création des techStacks : ${errors.join(', ')}`,
      );
    }

    return Result.ok(techStacks);
  }

  static fromPersistence(
    techStack: Array<{ id: string; name?: string; iconUrl?: string }>,
  ): Result<TechStack[]> {
    return Result.ok(
      techStack.map(
        (techStack) =>
          new TechStack(techStack.id, techStack.name, techStack.iconUrl),
      ),
    );
  }
}
