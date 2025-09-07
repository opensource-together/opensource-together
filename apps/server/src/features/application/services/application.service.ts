import { Inject, Injectable } from '@nestjs/common';
import { APPLICATION_REPOSITORY } from '../repositories/application.repository.interface';
import { ApplicationRepository } from '../repositories/application.repository.interface';
import { Result } from '@/libs/result';
import {
  PROJECT_REPOSITORY,
  ProjectRepository,
} from '@/features/project/repositories/project.repository.interface';
import { ApplicationProjectRole } from '../domain/application';
import { ProjectRoleService } from '@/features/project-role/services/project-role.service';
import { ProjectRole } from '@/features/project-role/domain/project-role';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly projectRoleService: ProjectRoleService,
  ) {}
  async applyToProjectRole(props: {
    userId: string;
    projectRoleId: string;
    projectId: string;
    motivationLetter: string;
  }): Promise<Result<ApplicationProjectRole, string>> {
    const { userId, projectRoleId, projectId, motivationLetter } = props;

    const projectRole =
      await this.projectRoleService.getProjectRole(projectRoleId);
    if (!projectRole.success) {
      return Result.fail('PROJECT_ROLE_NOT_FOUND');
    }

    if ((projectRole.value as ProjectRole).projectId !== projectId) {
      return Result.fail('PROJECT_ROLE_DOES_NOT_BELONG_TO_PROJECT');
    }

    const existingApplication =
      await this.applicationRepository.existsStatusApplication(
        userId,
        projectRoleId,
      );

    if (existingApplication.success && existingApplication.value) {
      return Result.fail(existingApplication.value);
    }
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail(project.error);
    }
    if (project.value.owner?.id === userId) {
      return Result.fail('Vous ne pouvez pas candidater à votre propre projet');
    }
    const result = await this.applicationRepository.applyToProjectRole({
      projectRoleId,
      userId,
      status: 'PENDING',
      motivationLetter,
      projectId,
    });
    if (!result.success) {
      return Result.fail(result.error);
    }
    return Result.ok(result.value);
  }
}
