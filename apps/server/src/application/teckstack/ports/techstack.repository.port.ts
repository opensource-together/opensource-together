import { TechStack } from '@/domain/techStack/techstack.entity';
import { Result } from '@/shared/result';

export const TECHSTACK_REPOSITORY_PORT = Symbol('TECHSTACK_REPOSITORY_PORT');
export interface TechStackRepositoryPort {
  getAll(): Promise<Result<TechStack[]>>;
  findByIds(ids: string[]): Promise<Result<TechStack[]>>;
  create(techStack: TechStack): Promise<Result<TechStack>>;
  delete(id: string): Promise<Result<boolean>>;
}
