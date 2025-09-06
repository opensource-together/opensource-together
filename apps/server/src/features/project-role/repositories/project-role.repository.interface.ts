import { UpdateProjectRoleDto } from '../controllers/dto/update-project-role.dto';
import { ProjectRole } from '../domain/project-role';

export const PROJECT_ROLE_REPOSITORY = Symbol('PROJECT_ROLE_REPOSITORY');

export interface CreateProjectRoleDto {
  title: string;
  description: string;
  techStacks: string[];
}
export interface ProjectRoleRepository {
  create(
    projectId: string,
    projectRoles: CreateProjectRoleDto[],
  ): Promise<ProjectRole[]>;
  update(
    roleId: string,
    projectRole: UpdateProjectRoleDto,
  ): Promise<ProjectRole>;
}
