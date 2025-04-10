import { IQuery } from '@nestjs/cqrs';

export class UserExistQuery implements IQuery {
  constructor(
    public readonly username: string,
    public readonly email: string,
  ) {}
}
