import { Result } from '@/libs/result';
import { ProjectGoals } from '../../domain/project-goals.entity';
export const PROJECT_GOALS_REPOSITORY_PORT = Symbol(
  'PROJECT_GOALS_REPOSITORY_PORT',
);
export interface ProjectGoalsRepositoryPort {
  updateMany(goals: ProjectGoals[]): Promise<Result<ProjectGoals[], string>>;
}
