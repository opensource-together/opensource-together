import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../ports/project-role-application.repository.port';
import { Result } from '@/libs/result';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';

export class GetApplicationByRoleIdQuery implements IQuery {
  constructor(
    public readonly props: {
      roleId: string;
      userId: string;
      projectId: string;
    },
  ) {}
}

@QueryHandler(GetApplicationByRoleIdQuery)
export class GetApplicationByRoleIdQueryHandler
  implements IQueryHandler<GetApplicationByRoleIdQuery, IQuery>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(query: GetApplicationByRoleIdQuery) {
    const { roleId, userId, projectId } = query.props;
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail(project.error);
    }
    const projectData = project.value.toPrimitive();
    if (projectData.id !== userId) {
      return Result.fail('You are not the owner of this project');
    }

    const applications =
      await this.projectRoleApplicationRepository.findByRoleId(roleId);
    if (!applications.success) {
      return applications.error;
    }
    return Result.ok(applications.value);
  }
}
