import { Result } from '@/shared/result';
import { ProjectRepositoryPort } from '../ports/project.repository.port';
import { Project } from '@/domain/project/project.entity';
export class GetProjectQuery {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}
  async execute(projectId: string): Promise<Result<Project>> {
    const project: Result<Project> =
      await this.projectRepository.findProjectById(projectId);
    if (!project.success) {
      return Result.fail(project.error);
    }
    return Result.ok(project.value);
  }
}
