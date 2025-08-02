import { Inject } from '@nestjs/common';
import { ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../ports/project-role-application.repository.port';

export class CancelApplicationCommand implements ICommand {
  constructor(
    public readonly props: {
      applicationId: string;
      userId: string;
    },
  ) {}
}

export class CancelApplicationCommandHandler
  implements ICommandHandler<CancelApplicationCommand>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
  ) {}
}
