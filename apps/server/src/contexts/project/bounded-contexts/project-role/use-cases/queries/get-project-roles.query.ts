import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  PROJECT_ROLE_REPOSITORY_PORT,
  ProjectRoleRepositoryPort,
} from '../ports/project-role.repository.port';
import { ProjectRole } from '../../domain/project-role.entity';

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
  ) {}

  async execute(
    query: GetProjectRolesQuery,
  ): Promise<Result<ProjectRole[] | [], string>> {
    const { projectId, userId } = query.props;
    if (!userId) {
      // Vérifier que le projet existe
      const projectRolesResult =
        await this.projectRoleRepo.findAllByProjectId(projectId);
      if (!projectRolesResult.success) {
        return Result.fail('Project not found');
      }
      return Result.ok(projectRolesResult.value);
    }
    return Result.ok([]);
  }
}
