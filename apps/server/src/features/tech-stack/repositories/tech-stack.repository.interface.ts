import { Result } from '@/libs/result';
import { TechStack } from '../domain/tech-stack';
export const TECH_STACK_REPOSITORY = Symbol('TECH_STACK_REPOSITORY');

export interface ITechStackRepository {
  getAll(): Promise<Result<TechStack[], string>>;
  findByIds(ids: string[]): Promise<Result<TechStack[], string>>;
}
