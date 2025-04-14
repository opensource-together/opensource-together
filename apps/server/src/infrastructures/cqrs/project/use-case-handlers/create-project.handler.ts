import { CreateProjectCommand } from './create-project.command';
import { Inject } from '@nestjs/common';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@application/ports/project.repository.port';
import { CreateProjectUseCase } from '@application/use-cases/create-project.usecase';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(command: CreateProjectCommand) {
    const useCase = new CreateProjectUseCase(this.projectRepo);
    return await useCase.execute(command);
  }
}
