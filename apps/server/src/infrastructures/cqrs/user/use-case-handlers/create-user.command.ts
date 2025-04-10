import { ICommand } from '@nestjs/cqrs';
export class CreateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
  ) {}
}
