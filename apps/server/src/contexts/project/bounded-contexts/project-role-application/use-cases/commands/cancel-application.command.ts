import { Inject } from '@nestjs/common';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../ports/project-role-application.repository.port';
import { Result } from '@/libs/result';

export class CancelApplicationCommand implements ICommand {
  constructor(
    public readonly props: {
      applicationId: string;
      userId: string;
    },
  ) {}
}

@CommandHandler(CancelApplicationCommand)
export class CancelApplicationCommandHandler
  implements ICommandHandler<CancelApplicationCommand>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
  ) {}

  async execute(
    command: CancelApplicationCommand,
  ): Promise<Result<void, string>> {
    const { applicationId, userId } = command.props;

    // 1. Récupérer l'application
    const applicationResult =
      await this.projectRoleApplicationRepository.findById(applicationId);
    if (!applicationResult.success) {
      return Result.fail('Application not found');
    }

    const application = applicationResult.value;

    // 2. Vérifier que l'utilisateur peut annuler cette application
    if (!application.canUserModify(userId)) {
      return Result.fail('You can only cancel your own pending applications');
    }

    // 3. Annuler l'application
    const cancelResult = application.cancel(userId);
    if (!cancelResult.success) {
      // Convertir l'erreur en string si c'est un objet
      const errorMessage =
        typeof cancelResult.error === 'string'
          ? cancelResult.error
          : JSON.stringify(cancelResult.error);
      return Result.fail(errorMessage);
    }

    // 4. Sauvegarder les modifications
    const updateResult =
      await this.projectRoleApplicationRepository.update(application);
    if (!updateResult.success) {
      return Result.fail('Failed to update application');
    }

    return Result.ok(undefined);
  }
}
