import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '@/contexts/project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindUserApplicationsQuery implements IQuery {
  constructor(
    public readonly props: {
      userId: string;
    },
  ) {}
}

@QueryHandler(FindUserApplicationsQuery)
export class FindUserApplicationsQueryHandler
  implements IQueryHandler<FindUserApplicationsQuery>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
  ) {}

  async execute(query: FindUserApplicationsQuery) {
    const { userId } = query.props;
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
    > = await this.projectRoleApplicationRepository.findAllByUserId(userId);
    if (!applications.success) {
      return Result.fail(applications.error);
    }
    return Result.ok(applications.value);
  }
}
