import { Result } from '@/shared/result';
import { Project } from '@domain/project/project.entity';
import { UpdateProjectInputsDto } from '@/application/dto/inputs/update-project-inputs.dto';
import { ProjectFilterInputsDto } from '@/application/dto/inputs/filter-project-input';
export const PROJECT_REPOSITORY_PORT = Symbol('PROJECT_REPOSITORY_PORT');
export interface ProjectRepositoryPort {
  save(project: Project): Promise<Result<Project>>;
  updateProjectById(
    id: string,
    project: UpdateProjectInputsDto,
    userId: string,
  ): Promise<Result<Project>>;
  findProjectById(id: string): Promise<Result<Project | null>>;
  findProjectByFilters(
    filters: ProjectFilterInputsDto,
  ): Promise<Result<Project[] | null>>;
  getAllProjects(): Promise<Result<Project[]>>;
}
