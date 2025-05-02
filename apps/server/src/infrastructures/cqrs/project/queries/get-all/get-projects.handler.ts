import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectsQuery } from './get-projects.query';
import { ProjectRepositoryPort } from '@/application/ports/project.repository.port';
import { Project } from '@/domain/project/project.entity';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/application/ports/project.repository.port';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepo.getAllProjects();
  }
}
