import { Result } from '@/shared/result';
import { Project } from '@domain/project/project.entity';
export const PROJECT_REPOSITORY_PORT = Symbol('PROJECT_REPOSITORY_PORT');
export interface ProjectRepositoryPort {
  save(project: Project): Promise<Result<Project>>;
  findProjectById(id: string): Promise<Result<Project | null>>;
  findProjectByTitle(title: string): Promise<Result<Project[] | null>>;
  getAllProjects(): Promise<Result<Project[]>>;
}
