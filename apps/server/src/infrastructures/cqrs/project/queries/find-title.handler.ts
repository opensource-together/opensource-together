import { QueryHandler } from '@nestjs/cqrs';
import { findTitleQuery } from './find-title.query';
import { Inject } from '@nestjs/common';
import { Project } from '@/domain/project/project.entity';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/application/ports/project.repository.port';

@QueryHandler(findTitleQuery)
export class findTitleHandler {
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(query: findTitleQuery): Promise<Project[] | null> {
    const projects = await this.projectRepo.findByTitle(query.title);

    return projects;
  }
}
