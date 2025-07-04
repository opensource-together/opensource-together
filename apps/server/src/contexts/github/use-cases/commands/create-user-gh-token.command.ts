import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@shared/result';
import { ENCRYPTION_SERVICE_PORT } from '@/application/encryption/ports/encryption.service.port';
import { EncryptionServicePort } from '@/application/encryption/ports/encryption.service.port';
import {
  USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
  UserGitHubCredentialsData,
  UserGitHubCredentialsRepositoryPort,
} from '../ports/user-github-credentials.repository.port';

export class CreateUserGhTokenCommand implements ICommand {
  constructor(
    public readonly props: {
      userId: string;
      githubUserId: string;
      githubAccessToken: string;
    },
  ) {}
}

/**
 * Use case responsible for updating users in the system.
 * Handles validation of unique username/email and user creation through the repository.
 */
@CommandHandler(CreateUserGhTokenCommand)
export class CreateUserGhTokenCommandHandler
  implements ICommandHandler<CreateUserGhTokenCommand>
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
    command: CreateUserGhTokenCommand,
  ): Promise<Result<UserGitHubCredentialsData, string>> {
    const { userId, githubUserId, githubAccessToken } = command.props;
    const encryptedGithubAccessToken =
      this.encryptionService.encrypt(githubAccessToken);
    if (!encryptedGithubAccessToken.success)
      return Result.fail(encryptedGithubAccessToken.error);

    const savedCredentialsResult = await this.userGitHubCredentialsRepo.create({
      userId,
      githubUserId,
      githubAccessToken: encryptedGithubAccessToken.value,
    });

    if (!savedCredentialsResult.success) {
      return Result.fail(
        'Erreur technique lors de la création des crédentials GitHub.',
      );
    }

    return Result.ok(savedCredentialsResult.value);
  }
}
