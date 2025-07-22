import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProfileRepositoryPort } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Result } from '@/libs/result';
import { PROFILE_REPOSITORY_PORT } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Inject } from '@nestjs/common';

export class DeleteProfileCommand implements ICommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileCommandHandler
  implements ICommandHandler<DeleteProfileCommand>
{
  constructor(
    @Inject(PROFILE_REPOSITORY_PORT)
    private readonly profileRepository: ProfileRepositoryPort,
  ) {}

  async execute(
    command: DeleteProfileCommand,
  ): Promise<Result<boolean, string>> {
    const { userId } = command;

    // Vérifier que le profil existe
    const profileResult = await this.profileRepository.findById(userId);
    if (!profileResult.success) {
      return Result.fail('Profile not found');
    }

    // Supprimer le profil
    const deleteResult = await this.profileRepository.delete(userId);
    if (!deleteResult.success) {
      return Result.fail(deleteResult.error);
    }

    return Result.ok(true);
  }
}