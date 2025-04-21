import { IQuery } from '@nestjs/cqrs';

export class findTitleQuery implements IQuery {
  constructor(public readonly title: string) {}
}
