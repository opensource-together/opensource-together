import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_ROLE_REPOSITORY,
  CreateProjectRoleDto,
  ProjectRoleRepository,
} from '../repositories/project-role.repository.interface';
import { validateProjectRole } from '../domain/project-role';
import { Result } from '@/libs/result';

@Injectable()
export class ProjectRoleService {
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY)
    private readonly projectRoleRepository: ProjectRoleRepository,
  ) {}

  async createProjectRole(projectRole: CreateProjectRoleDto[]) {
    const projectRoleValidation = projectRole.map((role) =>
      validateProjectRole(role),
    );
    if (projectRoleValidation.some((validation) => validation)) {
      return Result.fail(projectRoleValidation);
    }

    const projectRoleResult =
      await this.projectRoleRepository.create(projectRole);
    if (!projectRoleResult) {
      return Result.fail('DATABASE_ERROR');
    }
    return Result.ok(projectRoleResult);
  }
}
