import { Result } from '@/shared/result';
import { TechStack } from './techstack.entity';

export class TechStackFactory {
  static create(id: string, name: string, iconUrl: string): Result<TechStack> {
    const techStack = new TechStack(id, name, iconUrl);
    return Result.ok(techStack);
  }

  static createMany(
    techStacksData: Array<{ id: string; name: string; iconUrl: string }>,
  ): Result<TechStack[]> {
    const techStacks: TechStack[] = [];
    const errors: string[] = [];

    techStacksData.map((techStack) => {
      const result = this.create(
        techStack.id,
        techStack.name,
        techStack.iconUrl,
      );
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
}
