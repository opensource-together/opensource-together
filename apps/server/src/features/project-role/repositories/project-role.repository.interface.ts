import { ProjectRole } from '../domain/project-role';

export const PROJECT_ROLE_REPOSITORY = Symbol('PROJECT_ROLE_REPOSITORY');

export interface ProjectRoleRepository {
  create(data: ProjectRole[]): Promise<ProjectRole[]>;
}
