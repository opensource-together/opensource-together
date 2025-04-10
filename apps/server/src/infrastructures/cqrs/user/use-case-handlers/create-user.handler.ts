import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@application/ports/user.repository.port';
import { Inject } from '@nestjs/common';
import { CreateUserUseCase } from '@/application/use-cases/create-user.usecase';
import { CreateUserCommand } from './create-user.command';
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}
  async execute(command: CreateUserCommand) {
    const useCase = new CreateUserUseCase(this.userRepo);
    return await useCase.execute(command);
  }
}
