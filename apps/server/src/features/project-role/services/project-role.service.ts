import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_ROLE_REPOSITORY,
  ProjectRoleRepository,
} from '../repositories/project-role.repository.interface';
import { validateProjectRole } from '../domain/project-role';
import { canUserModifyProject } from '@/features/project/domain/project';
import { Result } from '@/libs/result';
import { UpdateProjectRoleDto } from '../controllers/dto/update-project-role.dto';
import { PROJECT_REPOSITORY } from '@/features/project/repositories/project.repository.interface';
import { ProjectRepository } from '@/features/project/repositories/project.repository.interface';

@Injectable()
export class ProjectRoleService {
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY)
    private readonly projectRoleRepository: ProjectRoleRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async getAllProjectRoles(projectId: string) {
    const projectRoleResult =
      await this.projectRoleRepository.getAll(projectId);
    if (!projectRoleResult.success) {
      return Result.fail('DATABASE_ERROR');
    }
    return Result.ok(projectRoleResult.value);
  }

  async createProjectRole(props: {
    userId: string;
    projectId: string;
    projectRole: {
      title: string;
      description: string;
      techStacks: string[];
    }[];
  }) {
    const { userId, projectId, projectRole } = props;
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail('PROJECT_NOT_FOUND');
    }
    if (!canUserModifyProject(project.value, userId)) {
      return Result.fail('UNAUTHORIZED');
    }
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

  async updateProjectRole(props: {
    roleId: string;
    projectId: string;
    projectRole: UpdateProjectRoleDto;
    userId: string;
  }) {
    const { roleId, projectRole, userId, projectId } = props;
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail('PROJECT_NOT_FOUND');
    }
    if (!canUserModifyProject(project.value, userId)) {
      return Result.fail('UNAUTHORIZED');
    }
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
      return Result.fail('PROJECT_ROLE_NOT_FOUND');
    }
    return Result.ok(projectRoleResult.value);
  }

  async deleteProjectRole(props: {
    roleId: string;
    userId: string;
    projectId: string;
  }) {
    const { roleId, userId, projectId } = props;
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail('PROJECT_NOT_FOUND');
    }
    if (!canUserModifyProject(project.value, userId)) {
      return Result.fail('UNAUTHORIZED');
    }
    const projectRoleResult = await this.projectRoleRepository.delete(roleId);
    if (!projectRoleResult.success) {
      return Result.fail('DATABASE_ERROR');
    }
    return Result.ok(projectRoleResult.value);
  }
}
