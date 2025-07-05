import { Result } from '@/libs/result';
import { Project } from '@/contexts/project/domain/project.entity';

export const PROJECT_REPOSITORY_PORT = Symbol('PROJECT_REPOSITORY_PORT');
export interface ProjectRepositoryPort {
  create(project: Project): Promise<Result<Project, string>>;
  findByTitle(title: string): Promise<Result<Project, string>>;
  delete(id: string): Promise<Result<boolean, string>>;
  update(id: string, project: Project): Promise<Result<Project, string>>;
  findById(id: string): Promise<Result<Project, string>>;
  getAllProjects(): Promise<Result<Project[], string>>;
  // findProjectByFilters(filters: ProjectFilterInputsDto): Promise<Result<Project[], string>>;
  // updateProjectById(
  //   id: string,
  //   project: UpdateProjectInputsDto,
  //   userId: string,
  // ): Promise<Result<Project>>;
  // deleteProjectById(id: string, ownerId: string): Promise<Result<boolean>>;
  // findProjectById(id: string): Promise<Result<Project | null>>;
}
