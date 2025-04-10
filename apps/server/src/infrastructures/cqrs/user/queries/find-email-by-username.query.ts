import { IQuery } from '@nestjs/cqrs';

export class FindEmailByUsernameQuery implements IQuery {
  constructor(public readonly username: string) {}
}
