import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@/shared/result';
import { Inject } from '@nestjs/common';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/application/project/ports/project.repository.port';

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

  async execute(command: DeleteProjectCommand): Promise<Result<boolean>> {
    const result = await this.projectRepo.deleteProjectById(
      command.id,
      command.ownerId,
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(true);
  }
}
