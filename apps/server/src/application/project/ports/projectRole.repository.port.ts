import { CreateProjectRoleInputsDto } from '@/application/dto/inputs/create-project-role-inputs.dto';
import { UpdateProjectRoleInputsDto } from '@/application/dto/inputs/update-project-role-inputs.dto';
import { ProjectRole } from '@/domain/projectRole/projectRole.entity';
import { Result } from '@/shared/result';

export const PROJECT_ROLE_REPOSITORY_PORT = Symbol('ProjectRoleRepositoryPort');
export interface ProjectRoleRepositoryPort {
  createProjectRole(
    payload: CreateProjectRoleInputsDto,
  ): Promise<Result<ProjectRole>>;

  updateProjectRoleById(
    projectId: string,
    roleId: string,
    ownerId: string,
    payload: UpdateProjectRoleInputsDto,
  ): Promise<Result<ProjectRole>>;

  // deleteProjectRoleById(id: string): Promise<Result<ProjectRole>>;
  // getProjectRoleById(id: string): Promise<Result<ProjectRole>>;
  // getProjectRolesByProjectId(projectId: string): Promise<Result<ProjectRole[]>>;
}
