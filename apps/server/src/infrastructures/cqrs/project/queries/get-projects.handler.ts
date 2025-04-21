import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectsQuery } from './get-projects.query';
import { ProjectRepositoryPort } from '@/application/ports/project.repository.port';
import { Project } from '@/domain/project/project.entity';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepo.getAllProjects();
  }
}
