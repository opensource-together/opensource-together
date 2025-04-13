import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from './create-project.command';
import { Inject } from '@nestjs/common';
import { ProjectRepositoryPort } from '@application/ports/project.repository.port';
import { PROJECT_REPOSITORY_PORT } from '@application/ports/project.repository.port';
import { CreateProjectUseCase } from '@application/use-cases/create-project.usecase';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(command: CreateProjectCommand) {
    const useCase = new CreateProjectUseCase(this.projectRepo);
    return await useCase.execute(command);
  }
}