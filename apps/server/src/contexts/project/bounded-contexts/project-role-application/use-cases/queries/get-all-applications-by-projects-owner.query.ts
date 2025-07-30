import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../ports/project-role-application.repository.port';
import { Inject } from '@nestjs/common';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { Result } from '@/libs/result';
import { Project } from '@/contexts/project/domain/project.entity';

export class GetAllApplicationsByProjectsOwnerQuery implements IQuery {
  constructor(public readonly ownerId: string) {}
}

@QueryHandler(GetAllApplicationsByProjectsOwnerQuery)
export class GetAllApplicationsByProjectsOwnerQueryHandler
  implements IQueryHandler<GetAllApplicationsByProjectsOwnerQuery>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(
    query: GetAllApplicationsByProjectsOwnerQuery,
  ): Promise<Result<any[], string>> {
    const { ownerId } = query;
    const projects: Result<Project[], string> =
      await this.projectRepository.findProjectsByUserId(ownerId);
    if (!projects.success) {
      return Result.fail(projects.error);
    }
    const applications: any[] = [];
    for (const project of projects.value) {
      if (!project.toPrimitive().id) {
        continue;
      }
      const applicationsResult =
        await this.projectRoleApplicationRepository.findAllByProjectId(
          project.toPrimitive().id!,
        );
      if (!applicationsResult.success) {
        return Result.fail(applicationsResult.error);
      }
      applications.push(...applicationsResult.value);
    }
    return Result.ok(applications);
  }
}
