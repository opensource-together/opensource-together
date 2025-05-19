import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthServicePort } from '@/application/auth/ports/auth.service.port';
import { AUTH_SERVICE_PORT } from '@/application/auth/ports/auth.service.port';
import { UserFactory } from '@/domain/user/user.factory';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@application/user/ports/user.repository.port';
import { User } from '@domain/user/user.entity';
import { Result } from '@shared/result';
import { Inject } from '@nestjs/common';
import { deleteUser } from 'supertokens-node';
import { Email } from '@/domain/user/email.vo';
import { Username } from '@/domain/user/username.vo';
export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
  ) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: AuthServicePort,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(
    command: RegisterUserCommand,
  ): Promise<Result<User, string | { username?: string; email?: string }>> {
    const validEmail = Email.create(command.email);
    const validUsername = Username.create(command.username);
    const error: { username?: string; email?: string } = {};
    if (!validEmail.success) error.email = validEmail.error;
    if (!validUsername.success) error.username = validUsername.error;
    if (error.username || error.email) return Result.fail(error);

    const [userExistsByUsername, userExistsByEmail] = await Promise.all([
      this.userRepository.findByUsername(command.username),
      this.userRepository.findByEmail(command.email),
    ]);
    if (userExistsByUsername.success || userExistsByEmail.success)
      return Result.fail(
        'Une erreur est survenue lors de la création de votre compte.',
      );

    const responseAuthService: Result<
      { userId: string; authProviderResponse: any },
      string
    > = await this.authService.signUp({
      email: command.email,
      password: command.password,
    });
    if (!responseAuthService.success)
      return Result.fail(
        'Une erreur est survenue lors de la création de votre compte.',
      );
    const { userId } = responseAuthService.value;
    if (!userId) {
      return Result.fail(
        'Une erreur est survenue lors de la création de votre compte.',
      );
    }
    const user = UserFactory.create(userId, command.username, command.email);
    if (!user.success) {
      await deleteUser(userId);
      return Result.fail(user.error);
    }
    const userSavedResult = await this.userRepository.save(user.value);
    if (!userSavedResult.success) {
      await deleteUser(userId);
      return Result.fail(userSavedResult.error);
    }
    return Result.ok(userSavedResult.value);
  }
}
