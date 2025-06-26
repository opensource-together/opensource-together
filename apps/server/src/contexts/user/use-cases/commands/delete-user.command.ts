import { Result } from '@/shared/result';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@/application/user/ports/user.repository.port';
import { Inject } from '@nestjs/common';

export class DeleteUserCommand implements ICommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(command: DeleteUserCommand): Promise<Result<string, string>> {
    const user = await this.userRepo.findById(command.userId);
    if (!user.success) return Result.fail(user.error as string);
    const deletedUser = await this.userRepo.delete(user.value);
    if (!deletedUser.success) return Result.fail(deletedUser.error);
    return Result.ok('User deleted successfully');
  }
}
