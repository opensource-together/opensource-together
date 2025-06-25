/**
 *
 *
 *
 * Use case pour tester la création d'un repository GitHub
 */
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/shared/result';
import {
  GITHUB_API_SERVICE_PORT,
  GitHubApiServicePort,
} from '@/application/github/ports/github-api.service.port';
import {
  ENCRYPTION_SERVICE_PORT,
  EncryptionServicePort,
} from '@/application/encryption/ports/encryption.service.port';
import { USER_GITHUB_CREDENTIALS_REPOSITORY_PORT } from '@/application/github/ports/user-github-credentials.repository.port';
import { UserGitHubCredentialsRepositoryPort } from '@/application/github/ports/user-github-credentials.repository.port';

export class CreateGitHubRepositoryCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly repoName: string,
    public readonly description?: string,
    public readonly isPrivate?: boolean,
  ) {}
}

@CommandHandler(CreateGitHubRepositoryCommand)
export class CreateGitHubRepositoryCommandHandler
  implements ICommandHandler<CreateGitHubRepositoryCommand>
{
  constructor(
    @Inject(USER_GITHUB_CREDENTIALS_REPOSITORY_PORT)
    private readonly userGitHubCredentialsRepo: UserGitHubCredentialsRepositoryPort,
    @Inject(GITHUB_API_SERVICE_PORT)
    private readonly githubApiService: GitHubApiServicePort,
    @Inject(ENCRYPTION_SERVICE_PORT)
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  async execute(
    command: CreateGitHubRepositoryCommand,
  ): Promise<Result<any, string>> {
    // 1. Récupérer l'utilisateur avec son token GitHub
    const userGhToken =
      await this.userGitHubCredentialsRepo.findGhTokenByUserId(command.userId);
    if (!userGhToken.success) {
      return Result.fail('Utilisateur non trouvé');
    }

    const decryptedGhToken = this.encryptionService.decrypt(userGhToken.value);

    // 2. Créer le repository GitHub
    if (!decryptedGhToken.success) {
      return Result.fail(
        `Erreur lors du déchiffrement du token GitHub: ${decryptedGhToken.error}`,
      );
    }
    console.log({ command });
    const createRepoResult = await this.githubApiService.createRepository(
      decryptedGhToken.value,
      {
        name: command.repoName,
        description: command.description,
        isPrivate: command.isPrivate,
      },
    );

    if (!createRepoResult.success) {
      return Result.fail(
        `Erreur lors de la création du repository: ${createRepoResult.error}`,
      );
    }

    return Result.ok(createRepoResult.value);
  }
}
