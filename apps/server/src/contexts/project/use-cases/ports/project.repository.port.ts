import { Result } from '@/shared/result';
import { Project } from '@/contexts/project/domain/project.entity';
export const PROJECT_REPOSITORY_PORT = Symbol('PROJECT_REPOSITORY_PORT');
export interface ProjectRepositoryPort {
  create(project: Project): Promise<Result<Project>>;
  findProjectByTitle(title: string): Promise<Result<Project>>;
  delete(id: string): Promise<Result<boolean>>;
  update(id: string, project: Project): Promise<Result<Project>>;
  findById(id: string): Promise<Result<Project>>;
  // updateProjectById(
  //   id: string,
  //   project: UpdateProjectInputsDto,
  //   userId: string,
  // ): Promise<Result<Project>>;
  // deleteProjectById(id: string, ownerId: string): Promise<Result<boolean>>;
  // findProjectById(id: string): Promise<Result<Project | null>>;
  // findProjectByFilters(
  //   filters: ProjectFilterInputsDto,
  // ): Promise<Result<Project[] | null>>;
  // getAllProjects(): Promise<Result<Project[]>>;
}
