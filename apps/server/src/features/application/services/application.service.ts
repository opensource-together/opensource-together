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
import { canUserModifyProject } from '@/features/project/domain/project';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly projectRoleService: ProjectRoleService,
  ) {}

  async getApplicationById(
    id: string,
  ): Promise<Result<ApplicationProjectRole, string>> {
    const application = await this.applicationRepository.findById(id);
    if (!application.success) {
      return Result.fail(application.error);
    }
    return Result.ok(application.value);
  }

  async getApplicationByRoleId(
    roleId: string,
  ): Promise<Result<ApplicationProjectRole, string>> {
    const application = await this.applicationRepository.findByRoleId(roleId);
    if (!application.success) {
      return Result.fail(application.error);
    }
    return Result.ok(application.value);
  }

  async getApplicationsByProjectId(
    projectId: string,
    userId: string,
  ): Promise<Result<ApplicationProjectRole[], string>> {
    console.log('projectId getApplicationsByProjectId', projectId);

    const project = await this.projectRepository.findById(projectId);
    console.log('project getApplicationsByProjectId', project);
    if (!project.success) {
      return Result.fail(project.error);
    }
    if (project.value.owner?.id !== userId) {
      return Result.fail(
        'Vous ne pouvez pas voir les candidatures de ce projet',
      );
    }
    const applications =
      await this.applicationRepository.findAllByProjectId(projectId);
    if (!applications.success) {
      return Result.fail(applications.error);
    }
    return Result.ok(applications.value);
  }

  async applyToProjectRole(props: {
    userId: string;
    projectRoleId: string;
    projectId: string;
    keyFeatures: string[];
    motivationLetter: string;
  }): Promise<Result<ApplicationProjectRole, string>> {
    const { userId, projectRoleId, projectId, motivationLetter, keyFeatures } =
      props;

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
      keyFeatures,
    });
    if (!result.success) {
      return Result.fail(result.error);
    }
    return Result.ok(result.value);
  }

  async cancelApplication(props: {
    userId: string;
    applicationId: string;
  }): Promise<Result<void, string>> {
    const { userId, applicationId } = props;
    const application =
      await this.applicationRepository.findById(applicationId);
    if (!application.success) {
      return Result.fail(application.error);
    }
    if (application.value.userId !== userId) {
      return Result.fail('Vous ne pouvez annuler que vos propres candidatures');
    }
    const result = await this.applicationRepository.cancelApplication({
      applicationId,
      userId,
    });
    if (!result.success)
      return Result.fail("Erreur lors de l'annulation de la candidature");
    return Result.ok(undefined);
  }

  async acceptApplication(props: {
    userId: string;
    applicationId: string;
  }): Promise<Result<void, string>> {
    const { userId, applicationId } = props;
    const application =
      await this.applicationRepository.findById(applicationId);
    if (!application.success) {
      return Result.fail(application.error);
    }
    const project = await this.projectRepository.findById(
      application.value.projectId,
    );
    if (!project.success) {
      return Result.fail(project.error);
    }
    if (!canUserModifyProject(project.value, userId)) {
      console.log(userId, project.value.owner?.id);
      return Result.fail(
        "Vous n'avez pas les permissions pour accepter cette candidature",
      );
    }
    const result = await this.applicationRepository.acceptApplication({
      applicationId,
      userId,
    });
    if (!result.success) return Result.fail(result.error);
    return Result.ok(undefined);
  }

  async rejectApplication(props: {
    userId: string;
    applicationId: string;
    rejectionReason?: string;
  }): Promise<Result<void, string>> {
    const { userId, applicationId, rejectionReason } = props;
    const application =
      await this.applicationRepository.findById(applicationId);
    if (!application.success) {
      return Result.fail(application.error);
    }
    const project = await this.projectRepository.findById(
      application.value.projectId,
    );
    if (!project.success) {
      return Result.fail(project.error);
    }
    if (!canUserModifyProject(project.value, userId)) {
      return Result.fail('Vous ne pouvez pas rejeter cette candidature');
    }
    const result = await this.applicationRepository.rejectApplication({
      applicationId,
      userId,
      rejectionReason,
    });
    if (!result.success) return Result.fail(result.error);
    return Result.ok(undefined);
  }

  async getApplicationsByUserId(
    userId: string,
  ): Promise<Result<ApplicationProjectRole[], string>> {
    console.log('getApplicationsByUserId', userId);
    const applications =
      await this.applicationRepository.findAllByUserId(userId);
    if (!applications.success) {
      return Result.fail(applications.error);
    }
    return Result.ok(applications.value);
  }
}
