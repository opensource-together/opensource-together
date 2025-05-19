import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '@shared/result';
import { Inject } from '@nestjs/common';
import { AUTH_SERVICE_PORT } from '../ports/auth.service.port';
import { AuthServicePort } from '../ports/auth.service.port';
export class SignInUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

@CommandHandler(SignInUserCommand)
export class SignInUserCommandHandler
  implements ICommandHandler<SignInUserCommand>
{
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: AuthServicePort,
  ) {}

  async execute(command: SignInUserCommand): Promise<Result<any>> {
    const signinResult: Result<any, string> = await this.authService.signIn(
      command.email,
      command.password,
    );

    if (!signinResult.success) return Result.fail(signinResult.error);

    return Result.ok(signinResult.value);
  }
}
