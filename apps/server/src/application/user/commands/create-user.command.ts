import { Result } from '@shared/result';
import { UserFactory } from '@/domain/user/user.factory';
import { User } from '@domain/user/user.entity';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../ports/user.repository.port';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ENCRYPTION_SERVICE_PORT } from '@/application/encryption/ports/encryption.service.port';
import { EncryptionServicePort } from '@/application/encryption/ports/encryption.service.port';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly avatarUrl: string,
    public readonly bio: string,
    public readonly githubUrl: string,
    public readonly githubUserId: string,
    public readonly githubAccessToken: string,
  ) {}
}

/**
 * Use case responsible for creating new users in the system.
 * Handles validation of unique username/email and user creation through the repository.
 */
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
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
    command: CreateUserCommand,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const encryptedGithubAccessToken = this.encryptionService.encrypt(
      command.githubAccessToken,
    );
    if (!encryptedGithubAccessToken.success)
      return Result.fail(
        "Erreur technique lors de la création de l'utilisateur.",
      );

    const [userExistsByUsername, userExistsByEmail] = await Promise.all([
      this.userRepo.findByUsername(command.username),
      this.userRepo.findByEmail(command.email),
    ]);
    if (userExistsByUsername.success || userExistsByEmail.success)
      return Result.fail('Identifiants incorrects.');

    const user: Result<User, { username?: string; email?: string } | string> =
      UserFactory.create({
        id: command.id,
        username: command.username,
        email: command.email,
        avatarUrl: command.avatarUrl,
        bio: command.bio,
        githubUrl: command.githubUrl,
        githubUserId: command.githubUserId,
        githubAccessToken: encryptedGithubAccessToken.value,
      });
    if (!user.success) return Result.fail(user.error);
    const savedUser: Result<
      User,
      { username?: string; email?: string } | string
    > = await this.userRepo.save(user.value);
    if (!savedUser.success)
      //TODO: faire un mapping des erreurs ?
      return Result.fail(
        "Erreur technique lors de la création de l'utilisateur.",
      );

    return Result.ok(savedUser.value);
  }
}
