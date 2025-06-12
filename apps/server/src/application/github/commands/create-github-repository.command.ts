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
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@/application/user/ports/user.repository.port';
import {
  GITHUB_API_SERVICE_PORT,
  GitHubApiServicePort,
} from '@/application/github/ports/github-api.service.port';
import {
  ENCRYPTION_SERVICE_PORT,
  EncryptionServicePort,
} from '@/application/encryption/ports/encryption.service.port';

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
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
    @Inject(GITHUB_API_SERVICE_PORT)
    private readonly githubApiService: GitHubApiServicePort,
    @Inject(ENCRYPTION_SERVICE_PORT)
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  async execute(
    command: CreateGitHubRepositoryCommand,
  ): Promise<Result<any, string>> {
    // 1. Récupérer l'utilisateur avec son token GitHub
    const userResult = await this.userRepo.findById(command.userId);
    if (!userResult.success) {
      return Result.fail('Utilisateur non trouvé');
    }

    const user = userResult.value;
    const githubToken = user.getGithubAccessToken();
    console.log({ githubToken });
    const decryptedGithubToken = this.encryptionService.decrypt(githubToken);
    console.log({ githubToken });
    console.log({ decryptedGithubToken });

    if (!githubToken) {
      return Result.fail('Token GitHub non disponible pour cet utilisateur');
    }

    // 2. Créer le repository GitHub
    if (!decryptedGithubToken.success) {
      return Result.fail(
        `Erreur lors du déchiffrement du token GitHub: ${decryptedGithubToken.error}`,
      );
    }
    console.log({ command });
    const createRepoResult = await this.githubApiService.createRepository(
      decryptedGithubToken.value,
      {
        name: command.repoName,
        description: command.description,
        isPrivate: command.isPrivate,
      },
    );
    console.log({ createRepoResult });

    if (!createRepoResult.success) {
      return Result.fail(
        `Erreur lors de la création du repository: ${createRepoResult.error}`,
      );
    }

    return Result.ok(createRepoResult.value);
  }
}
