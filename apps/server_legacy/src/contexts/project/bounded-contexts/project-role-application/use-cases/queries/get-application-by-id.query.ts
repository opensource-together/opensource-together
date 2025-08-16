import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../ports/project-role-application.repository.port';
import { Result } from '@/libs/result';

export class GetApplicationByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetApplicationByIdQuery)
export class GetApplicationByIdQueryHandler
  implements IQueryHandler<GetApplicationByIdQuery>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
  ) {}

  async execute(query: GetApplicationByIdQuery) {
    const { id } = query;
    const application =
      await this.projectRoleApplicationRepository.findById(id);
    if (!application.success) {
      return Result.fail(application.error);
    }
    return Result.ok(application.value);
  }
}
