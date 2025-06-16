import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@shared/result';
import { ENCRYPTION_SERVICE_PORT } from '@/application/encryption/ports/encryption.service.port';
import { EncryptionServicePort } from '@/application/encryption/ports/encryption.service.port';
import {
  USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
  UserGitHubCredentialsRepositoryPort,
} from '../ports/user-github-credentials.repository';
import { UserGitHubCredentials } from '@/domain/user/user-github-credentials.entity';
import { UserGitHubCredentialsFactory } from '@/domain/user/user-github-credentials.factory';

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
  ): Promise<Result<UserGitHubCredentials, string>> {
    const encryptedGithubAccessToken = this.encryptionService.encrypt(
      command.githubAccessToken,
    );
    if (!encryptedGithubAccessToken.success)
      return Result.fail(encryptedGithubAccessToken.error);
    const ghToken: Result<string, string> =
      await this.userGitHubCredentialsRepo.findGhTokenByUserId(command.userId);
    if (!ghToken.success) return Result.fail(ghToken.error);

    const userGitHubCredentialsToUpdate =
      UserGitHubCredentialsFactory.reconstitute({
        userId: command.userId,
        githubUserId: command.githubUserId,
        githubAccessToken: encryptedGithubAccessToken.value,
      });
    const updatedUserGitHubCredentials =
      await this.userGitHubCredentialsRepo.update(
        userGitHubCredentialsToUpdate,
      );
    if (!updatedUserGitHubCredentials.success)
      return Result.fail(updatedUserGitHubCredentials.error);

    return Result.ok(updatedUserGitHubCredentials.value);
  }
}
