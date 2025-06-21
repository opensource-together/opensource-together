import { TechStack } from '@/domain/techStack/techstack.entity';
import { Result } from '@/shared/result';

export const TECHSTACK_REPOSITORY_PORT = Symbol('TECHSTACK_REPOSITORY_PORT');
export interface TechstackRepositoryPort {
  getAll(): Promise<Result<TechStack[]>>;
}
