import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';

export class DeleteProjectCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
  ) {}
}

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectCommandHandler
  implements ICommandHandler<DeleteProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(
    command: DeleteProjectCommand,
  ): Promise<Result<boolean, string>> {
    const { id, ownerId } = command;

    // Vérifier que le projet existe et récupérer ses détails
    const projectResult = await this.projectRepo.findById(id);
    if (!projectResult.success) {
      return Result.fail('Project not found');
    }

    const project = projectResult.value;

    // Vérifier que l'utilisateur est bien le propriétaire du projet
    if (!project.hasOwnerId(ownerId)) {
      return Result.fail('You are not allowed to delete this project');
    }

    // Supprimer le projet
    const deleteResult = await this.projectRepo.delete(id);
    if (!deleteResult.success) {
      return Result.fail(deleteResult.error);
    }

    return Result.ok(true);
  }
}
