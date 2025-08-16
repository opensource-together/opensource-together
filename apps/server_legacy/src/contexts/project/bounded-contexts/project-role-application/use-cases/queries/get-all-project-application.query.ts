import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../ports/project-role-application.repository.port';

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
        applicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        project: {
          id: string;
          title: string;
          shortDescription: string;
          image?: string;
          owner: {
            id: string;
            username: string;
            login: string;
            email: string;
            provider: string;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string;
          };
        };
        projectRole: {
          id: string;
          projectId?: string;
          title: string;
          description: string;
          techStacks: {
            id: string;
            name: string;
            iconUrl?: string;
          }[];
          roleCount?: number;
          projectGoal?: {
            id?: string;
            projectId?: string;
            goal: string;
          }[];
        };
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
        selectedKeyFeatures: {
          feature: string;
        }[];
        selectedProjectGoals: {
          goal: string;
        }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy?: string;
        rejectionReason?: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl?: string;
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
