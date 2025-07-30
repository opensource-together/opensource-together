import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import {
  ProjectRoleApplicationRepositoryPort,
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
} from '../ports/project-role-application.repository.port';
import {
  ProjectRepositoryPort,
  PROJECT_REPOSITORY_PORT,
} from '@/contexts/project/use-cases/ports/project.repository.port';

export class GetAllProjectApplicationsQueryByProjectId implements IQuery {
  constructor(
    public readonly props: {
      projectId: string;
      userId: string;
    },
  ) {}
}

@QueryHandler(GetAllProjectApplicationsQueryByProjectId)
export class GetAllProjectApplicationsQueryByProjectIdHandler
  implements IQueryHandler<GetAllProjectApplicationsQueryByProjectId>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(query: GetAllProjectApplicationsQueryByProjectId) {
    const { projectId, userId } = query.props;
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail(project.error);
    }
    const projectData = project.value.toPrimitive();
    if (projectData.ownerId !== userId) {
      return Result.fail('You are not the owner of this project');
    }
    const applications: Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: { id: string; feature: string }[];
        selectedProjectGoals: { id: string; goal: string }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          username: string;
          avatarUrl: string;
        };
      }[]
    > =
      await this.projectRoleApplicationRepository.findAllByProjectId(projectId);
    if (!applications.success) {
      return Result.fail(applications.error);
    }
    return Result.ok(applications.value);
  }
}
