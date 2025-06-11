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

    techStacksData.map((techStack) => {
      const result = this.create(
        techStack.id,
        techStack.name,
        techStack.iconUrl,
      );
      if (result.success) {
        techStacks.push(result.value);
      }
    });

    if (techStacks.length === 0) {
      return Result.fail("Aucune techStack n'ont été selectionnées");
    }

    return Result.ok(techStacks);
  }
}
