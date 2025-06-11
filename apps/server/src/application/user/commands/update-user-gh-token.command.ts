import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@shared/result';
import { UserFactory } from '@/domain/user/user.factory';
import { User } from '@domain/user/user.entity';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../ports/user.repository.port';
import { ENCRYPTION_SERVICE_PORT } from '@/application/encryption/ports/encryption.service.port';
import { EncryptionServicePort } from '@/application/encryption/ports/encryption.service.port';

export class UpdateGithubTokenUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly githubUserId: string,
    public readonly githubAccessToken: string,
  ) {}
}

/**
 * Use case responsible for updating users in the system.
 * Handles validation of unique username/email and user creation through the repository.
 */
@CommandHandler(UpdateGithubTokenUserCommand)
export class UpdateGithubTokenUserCommandHandler
  implements ICommandHandler<UpdateGithubTokenUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
    @Inject(ENCRYPTION_SERVICE_PORT)
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  /**
   * Creates a new user in the system.
   * @param command - The command containing user creation details
   * @returns A Result object containing either the created User entity or error details
   *          Error can be either validation errors for username/email or a general error message
   * @throws Never - All errors are handled and returned in the Result object
   */
  async execute(
    command: UpdateGithubTokenUserCommand,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const encryptedGithubAccessToken = this.encryptionService.encrypt(
      command.githubAccessToken,
    );
    if (!encryptedGithubAccessToken.success)
      return Result.fail(encryptedGithubAccessToken.error);
    const user: Result<User, string | { username?: string; email?: string }> =
      await this.userRepo.findById(command.id);
    if (!user.success) return Result.fail(user.error);

    const userToUpdate = UserFactory.create({
      id: user.value.getId(),
      username: user.value.getUsername(),
      email: user.value.getEmail(),
      avatarUrl: user.value.getAvatarUrl(),
      bio: user.value.getBio(),
      githubUrl: user.value.getGithubUrl(),
      githubUserId: user.value.getGithubUserId(),
      githubAccessToken: encryptedGithubAccessToken.value,
    });
    if (!userToUpdate.success) return Result.fail(userToUpdate.error);
    const updatedUser: Result<
      User,
      { username?: string; email?: string } | string
    > = await this.userRepo.update(userToUpdate.value);
    if (!updatedUser.success)
      //TODO: faire un mapping des erreurs ?
      return Result.fail(
        "Erreur technique lors de la mise à jour de l'utilisateur.",
      );

    return Result.ok(updatedUser.value);
  }
}
