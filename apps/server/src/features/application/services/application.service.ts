import { Inject, Injectable } from '@nestjs/common';
import { APPLICATION_REPOSITORY } from '../repositories/application.repository.interface';
import { ApplicationRepository } from '../repositories/application.repository.interface';
import { Result } from '@/libs/result';
import {
  PROJECT_REPOSITORY,
  ProjectRepository,
} from '@/features/project/repositories/project.repository.interface';
import { ApplicationProjectRole } from '../domain/application';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}
  async applyToProjectRole(props: {
    userId: string;
    projectRoleId: string;
    projectId: string;
    motivationLetter: string;
  }): Promise<Result<ApplicationProjectRole, string>> {
    const { userId, projectRoleId, projectId, motivationLetter } = props;
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
