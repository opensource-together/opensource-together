import { Project } from '@domain/project/project.entity';
export const PROJECT_REPOSITORY_PORT = Symbol('PROJECT_REPOSITORY_PORT');
export interface ProjectRepositoryPort {
  save(project: Project): Promise<void>;
  findProjectById(id: string): Promise<Project | null>;
  findProjectByTitle(title: string): Promise<Project[] | null>;
  getAllProjects(): Promise<Project[]>;
}
