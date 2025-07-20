import { KeyFeature } from '@/contexts/project/bounded-contexts/project-key-feature/domain/key-feature.entity';
import { Result } from '@/libs/result';

export const PROJECT_KEY_FEATURE_REPOSITORY_PORT = Symbol(
  'PROJECT_KEY_FEATURE_REPOSITORY_PORT',
);

export interface ProjectKeyFeatureRepositoryPort {
  create(keyFeature: KeyFeature[]): Promise<Result<KeyFeature[], string>>;
  delete(keyFeature: KeyFeature): Promise<Result<KeyFeature, string>>;
  update(keyFeature: KeyFeature): Promise<Result<KeyFeature, string>>;
  updateMany(keyFeature: KeyFeature[]): Promise<Result<KeyFeature[], string>>;
}
