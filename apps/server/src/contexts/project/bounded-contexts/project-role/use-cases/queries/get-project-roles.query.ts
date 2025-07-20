import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  PROJECT_ROLE_REPOSITORY_PORT,
  ProjectRoleRepositoryPort,
} from '../ports/project-role.repository.port';
import { ProjectRole } from '../../domain/project-role.entity';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../../../project-role-application/use-cases/ports/project-role-application.repository.port';

export class GetProjectRolesQuery implements IQuery {
  constructor(
    public readonly props: {
      projectId: string;
      userId?: string;
    },
  ) {}
}

@QueryHandler(GetProjectRolesQuery)
export class GetProjectRolesQueryHandler
  implements IQueryHandler<GetProjectRolesQuery>
{
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepo: ProjectRoleRepositoryPort,
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepo: ProjectRoleApplicationRepositoryPort,
  ) {}

  async execute(
    query: GetProjectRolesQuery,
  ): Promise<
    Result<ProjectRole[] | (ProjectRole[] & { hasApplied?: boolean }[]), string>
  > {
    const { projectId, userId } = query.props;
    const projectRolesResult =
      await this.projectRoleRepo.findAllByProjectId(projectId);
    if (!projectRolesResult.success) {
      return Result.fail('Project not found');
    }
    if (!userId) return Result.ok(projectRolesResult.value);

    // Vérifier si l'utilisateur a deja apply
    const projectRolesEnriched: ProjectRole[] & { hasApplied?: boolean }[] = [];
    for (const role of projectRolesResult.value) {
      const projectRoleEnriched: ProjectRole & { hasApplied?: boolean } = role;
      const projectRoleApplicationsResult =
        await this.projectRoleApplicationRepo.existsPendingApplication(
          userId,
          role.toPrimitive().id as string,
        );
      if (projectRoleApplicationsResult.success) {
        if (projectRoleApplicationsResult.value) {
          projectRoleEnriched.hasApplied = true;
        }
      }
      projectRolesEnriched.push(projectRoleEnriched);
    }
    return Result.ok(projectRolesEnriched);
  }
}
