import { Project } from '@domain/project/project.entity';
export const PROJECT_REPOSITORY_PORT = Symbol('PROJECT_REPOSITORY_PORT');
export interface ProjectRepositoryPort {
  save(project: Project): Promise<void>;
  // findById(id: string): Promise<Project | null>;
  // findByUserId(userId: string): Promise<Project[] | null>;
}
