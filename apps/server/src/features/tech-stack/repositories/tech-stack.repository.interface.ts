import { TechStack } from '../domain/tech-stack';

export const TECH_STACK_REPOSITORY = Symbol('TECH_STACK_REPOSITORY');

export interface TechStackRepository {
  findByIds(ids: string[]): Promise<TechStack[]>;
}
