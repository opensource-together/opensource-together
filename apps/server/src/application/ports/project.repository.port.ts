import { Project } from '@domain/project/project.entity';
import { Result } from '@/shared/result';
export const PROJECT_REPOSITORY_PORT = Symbol('PROJECT_REPOSITORY_PORT');

export interface ProjectRepositoryPort {
  save(project: Project): Promise<Result<Project>>;
  findProjectById(id: string): Promise<Result<Project>>;
  findProjectByTitle(title: string): Promise<Result<Project[]>>;
  getAllProjects(): Promise<Result<Project[]>>;
}
