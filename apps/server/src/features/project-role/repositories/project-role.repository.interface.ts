import { Result } from '@/libs/result';
import { UpdateProjectRoleDto } from '../controllers/dto/update-project-role.dto';
import { ProjectRole } from '../domain/project-role';

export const PROJECT_ROLE_REPOSITORY = Symbol('PROJECT_ROLE_REPOSITORY');

export interface CreateProjectRoleDto {
  title: string;
  description: string;
  techStacks: string[];
}
export interface ProjectRoleRepository {
  getAll(projectId: string): Promise<Result<ProjectRole[], string>>;
  create(
    projectId: string,
    projectRoles: CreateProjectRoleDto[],
  ): Promise<Result<ProjectRole[], string>>;
  findById(roleId: string): Promise<Result<ProjectRole, string>>;
  update(
    roleId: string,
    projectRole: UpdateProjectRoleDto,
  ): Promise<Result<ProjectRole, string>>;
  delete(roleId: string): Promise<Result<void, string>>;
}
