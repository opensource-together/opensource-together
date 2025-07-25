import { Result } from '@/libs/result';
import { User } from '@/contexts/user/domain/user.entity';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../ports/user.repository.port';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
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
    const [userExistsByUsername, userExistsByEmail] = await Promise.all([
      this.userRepo.findByUsername(command.username),
      this.userRepo.findByEmail(command.email),
    ]);
    if (userExistsByUsername.success || userExistsByEmail.success)
      return Result.fail('Identifiants incorrects.');

    const validUser = User.create({
      id: command.id,
      username: command.username,
      email: command.email,
    });
    if (!validUser.success) return Result.fail(validUser.error);

    const savedUser: Result<User, string> = await this.userRepo.create(
      validUser.value,
    );
    if (!savedUser.success)
      //TODO: faire un mapping des erreurs ?
      return Result.fail(
        "Erreur technique lors de la création de l'utilisateur.",
      );

    return Result.ok(savedUser.value);
  }
}
