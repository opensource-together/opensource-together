import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/shared/result';
import {
  PROJECT_ROLE_REPOSITORY_PORT,
  ProjectRoleRepositoryPort,
} from '../ports/project-role.repository.port';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { ProjectRole } from '../../domain/project-role.entity';

export class GetProjectRolesQuery implements IQuery {
  constructor(public readonly projectId: string) {}
}

@QueryHandler(GetProjectRolesQuery)
export class GetProjectRolesQueryHandler
  implements IQueryHandler<GetProjectRolesQuery>
{
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepo: ProjectRoleRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(
    query: GetProjectRolesQuery,
  ): Promise<Result<ProjectRole[], string>> {
    const { projectId } = query;

    // Vérifier que le projet existe
    const projectResult = await this.projectRepo.findById(projectId);
    if (!projectResult.success) {
      return Result.fail('Project not found');
    }

    // Récupérer tous les rôles du projet
    const rolesResult = await this.projectRoleRepo.findByProjectId(projectId);
    if (!rolesResult.success) {
      return Result.fail(rolesResult.error);
    }

    return Result.ok(rolesResult.value);
  }
}
