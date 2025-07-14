import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '@/libs/result';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';
import { Inject } from '@nestjs/common';
import {
  ProjectRoleApplicationRepositoryPort,
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
} from '../ports/project-role-application.repository.port';

export class GetAllProjectApplicationsQuery implements IQuery {
  constructor(public readonly projectId: string) {}
}

@QueryHandler(GetAllProjectApplicationsQuery)
export class GetAllProjectApplicationsQueryHandler
  implements IQueryHandler<GetAllProjectApplicationsQuery>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
  ) {}

  async execute(query: GetAllProjectApplicationsQuery) {
    const applications: Result<ProjectRoleApplication[]> =
      await this.projectRoleApplicationRepository.findAll(query.projectId);
    if (!applications.success) {
      return Result.fail(applications.error);
    }
    return Result.ok(applications.value);
  }
}
