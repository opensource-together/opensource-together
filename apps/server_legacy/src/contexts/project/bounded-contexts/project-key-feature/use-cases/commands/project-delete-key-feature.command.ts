import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import {
  PROJECT_KEY_FEATURE_REPOSITORY_PORT,
  ProjectKeyFeatureRepositoryPort,
} from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/ports/project-key-feature.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import { KeyFeature } from '@/contexts/project/bounded-contexts/project-key-feature/domain/key-feature.entity';

export class DeleteKeyFeatureCommand implements ICommand {
  constructor(
    public readonly projectId: string,
    public readonly keyFeatureId: string,
    public readonly ownerId: string,
  ) {}
}

@CommandHandler(DeleteKeyFeatureCommand)
export class DeleteKeyFeatureCommandHandler
  implements ICommandHandler<DeleteKeyFeatureCommand, Result<Project, string>>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(PROJECT_KEY_FEATURE_REPOSITORY_PORT)
    private readonly projectKeyFeatureRepo: ProjectKeyFeatureRepositoryPort,
  ) {}

  async execute(
    command: DeleteKeyFeatureCommand,
  ): Promise<Result<Project, string>> {
    const { projectId, keyFeatureId, ownerId } = command;

    // Vérifier que le projet existe et que l'utilisateur en est propriétaire
    const projectResult = await this.projectRepo.findById(projectId);
    if (!projectResult.success) {
      return Result.fail('Project not found');
    }

    const project = projectResult.value;
    if (!project.hasOwnerId(ownerId)) {
      return Result.fail('You are not allowed to delete this key feature');
    }

    // Supprimer la keyFeature
    const deleteResult = await this.projectKeyFeatureRepo.delete(
      new KeyFeature({
        id: keyFeatureId,
        projectId,
        feature: '',
      }),
    );
    if (!deleteResult.success) {
      return Result.fail(deleteResult.error);
    }

    const projectAfterDelete = await this.projectRepo.findById(projectId);
    if (!projectAfterDelete.success) {
      return Result.fail(projectAfterDelete.error);
    }
    return Result.ok(projectAfterDelete.value);
  }
}
