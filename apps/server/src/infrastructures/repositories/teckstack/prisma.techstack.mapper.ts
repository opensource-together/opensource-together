import { TechStack } from '@/domain/techStack/techstack.entity';
import { Result } from '@/shared/result';
import { TechStack as PrismaTechStack } from '@prisma/client';

export class PrismaTechstackMapper {
  static toDomain(prismaTechstack: PrismaTechStack): Result<TechStack> {
    return Result.ok(
      new TechStack(
        prismaTechstack.id,
        prismaTechstack.name,
        prismaTechstack.iconUrl,
      ),
    );
  }

  static toPrisma(techstack: TechStack): PrismaTechStack {
    return {
      id: techstack.getId(),
      name: techstack.getName() || '',
      iconUrl: techstack.getIconUrl() || '',
    };
  }
}
