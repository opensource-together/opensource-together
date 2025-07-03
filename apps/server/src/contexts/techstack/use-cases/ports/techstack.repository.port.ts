import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { Result } from '@/shared/result';

export type TechStackId = string;

export const TECHSTACK_REPOSITORY_PORT = Symbol('TECHSTACK_REPOSITORY_PORT');
export interface TechStackRepositoryPort {
  // getAll(): Promise<Result<TechStack[], string>>;
  findByIds(ids: string[]): Promise<Result<TechStack[], string>>;
  // create(techStack: TechStack): Promise<Result<TechStack, string>>;
  // delete(id: string): Promise<Result<boolean, string>>;
}
