import { KeyFeature } from '@/contexts/project/bounded-contexts/project-key-feature/domain/key-feature.entity';
import { Result } from '@/libs/result';
import { KeyFeature as PrismaKeyFeature } from '@prisma/client';

export class PrismaProjectKeyFeatureMapper {
  static toDomain(keyFeature: PrismaKeyFeature): Result<KeyFeature, string> {
    const keyFeatureResult = KeyFeature.create({
      id: keyFeature.id,
      feature: keyFeature.feature,
    });
    if (!keyFeatureResult.success)
      return Result.fail(keyFeatureResult.error as string);
    return Result.ok(keyFeatureResult.value);
  }

  static toRepo(keyFeature: KeyFeature): PrismaKeyFeature {
    const { id, feature, projectId } = keyFeature.toPrimitive();
    return {
      id: id ?? '',
      feature: feature,
      projectId: projectId ?? '',
    };
  }
}
