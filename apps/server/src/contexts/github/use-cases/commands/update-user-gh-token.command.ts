import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@shared/result';
import { ENCRYPTION_SERVICE_PORT } from '@/contexts/encryption/ports/encryption.service.port';
import { EncryptionServicePort } from '@/contexts/encryption/ports/encryption.service.port';
import {
  USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
  UserGitHubCredentialsData,
  UserGitHubCredentialsRepositoryPort,
} from '../ports/user-github-credentials.repository.port';

export class UpdateUserGhTokenCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly githubUserId: string,
    public readonly githubAccessToken: string,
  ) {}
}

/**
 * Use case responsible for updating users in the system.
 * Handles validation of unique username/email and user creation through the repository.
 */
@CommandHandler(UpdateUserGhTokenCommand)
export class UpdateUserGhTokenCommandHandler
  implements ICommandHandler<UpdateUserGhTokenCommand>
{
  constructor(
    @Inject(USER_GITHUB_CREDENTIALS_REPOSITORY_PORT)
    private readonly userGitHubCredentialsRepo: UserGitHubCredentialsRepositoryPort,
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
    command: UpdateUserGhTokenCommand,
  ): Promise<Result<UserGitHubCredentialsData, string>> {
    const encryptedGithubAccessToken = this.encryptionService.encrypt(
      command.githubAccessToken,
    );
    if (!encryptedGithubAccessToken.success)
      return Result.fail(encryptedGithubAccessToken.error);

    const updatedCredentialsResult =
      await this.userGitHubCredentialsRepo.update({
        userId: command.userId,
        githubUserId: command.githubUserId,
        githubAccessToken: encryptedGithubAccessToken.value,
      });

    if (!updatedCredentialsResult.success) {
      return Result.fail(updatedCredentialsResult.error);
    }

    return Result.ok(updatedCredentialsResult.value);
  }
}
