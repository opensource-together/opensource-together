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
    //verifier toutes les regle métier avant ? que techStacks ?
    const techStacks = TechStackFactory.createMany(
      createProjectDtoInput.techStacks,
    );

    if (!techStacks.success) {
      return Result.fail(techStacks.error);
    }

    //vérifier si un projet n'existe pas déjà avec le même titre ?
    const project = ProjectFactory.create({
      ...createProjectDtoInput,
      techStacks: techStacks.value,
    });
    if (!project.success) {
      return Result.fail(project.error);
    }
    const savedProject = await this.projectRepo.save(project.value);
    if (!savedProject.success) {
      return Result.fail(savedProject.error);
    }

    return Result.ok(savedProject.value);
  }
}
