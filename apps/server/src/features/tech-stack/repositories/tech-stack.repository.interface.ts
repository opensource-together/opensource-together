import { TechStack } from '../domain/tech-stack';
import { Result } from '@/libs/result';
export const TECH_STACK_REPOSITORY = Symbol('TECH_STACK_REPOSITORY');

export interface TechStackRepository {
  findByIds(ids: string[]): Promise<Result<TechStack[], string>>;
}
