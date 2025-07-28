import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import {
  ProjectRoleApplicationRepositoryPort,
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
} from '@/contexts/project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';

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
        appplicationId: string;
        projectTitle: string;
        projectDescription: string;
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
      }[]
    > = await this.projectRoleApplicationRepository.findAllByUserId(userId);
    if (!applications.success) {
      return Result.fail(applications.error);
    }
    return Result.ok(applications.value);
  }
}
