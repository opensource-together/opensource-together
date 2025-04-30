import { Project } from '@/domain/project/project.entity';
import { CreateProjectDtoInput } from '../dto/create-project-inputs.dto';
import { Result } from '@/shared/result';
import { ProjectRepositoryPort } from '@application/ports/project.repository.port';
import { ProjectFactory } from '@/domain/project/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
export class CreateProjectUseCase {
  constructor(private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(
    createProjectDtoInput: CreateProjectDtoInput,
  ): Promise<Result<Project>> {
    const techStacks = TechStackFactory.createMany(
      createProjectDtoInput.techStacks,
    );

    if (!techStacks.success) {
      return Result.fail(techStacks.error);
    }

    const project = ProjectFactory.create(
      null,
      createProjectDtoInput.title,
      createProjectDtoInput.description,
      createProjectDtoInput.link,
      createProjectDtoInput.status,
      createProjectDtoInput.userId,
      techStacks.value,
    );
    if (!project.success) {
      return Result.fail(project.error);
    }
    console.log(project.value);
    await this.projectRepo.save(project.value);
    return Result.ok(project.value);
  }
}
