import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_ROLE_REPOSITORY,
  ProjectRoleRepository,
} from '../repositories/project-role.repository.interface';
import { validateProjectRole } from '../domain/project-role';
import { Result } from '@/libs/result';
import { UpdateProjectRoleDto } from '../controllers/dto/update-project-role.dto';

@Injectable()
export class ProjectRoleService {
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY)
    private readonly projectRoleRepository: ProjectRoleRepository,
  ) {}

  async getAllProjectRoles(projectId: string) {
    const projectRoleResult =
      await this.projectRoleRepository.getAll(projectId);
    if (!projectRoleResult.success) {
      return Result.fail('DATABASE_ERROR');
    }
    return Result.ok(projectRoleResult.value);
  }

  async createProjectRole(
    projectId: string,
    projectRole: {
      title: string;
      description: string;
      techStacks: string[];
    }[],
  ) {
    const projectRoleValidation = projectRole.map((role) =>
      validateProjectRole(role),
    );
    if (projectRoleValidation.some((validation) => validation)) {
      return Result.fail(projectRoleValidation);
    }

    const projectRoleResult = await this.projectRoleRepository.create(
      projectId,
      projectRole,
    );
    if (!projectRoleResult.success) {
      return Result.fail('DATABASE_ERROR');
    }
    return Result.ok(projectRoleResult.value);
  }

  async updateProjectRole(roleId: string, projectRole: UpdateProjectRoleDto) {
    const projectRoleResult = await this.projectRoleRepository.update(
      roleId,
      projectRole,
    );
    if (!projectRoleResult.success) {
      return Result.fail('DATABASE_ERROR');
    }
    return Result.ok(projectRoleResult.value);
  }

  async getProjectRole(roleId: string) {
    const projectRoleResult = await this.projectRoleRepository.findById(roleId);
    if (!projectRoleResult.success) {
      return Result.fail('DATABASE_ERROR');
    }
    return Result.ok(projectRoleResult.value);
  }
}
