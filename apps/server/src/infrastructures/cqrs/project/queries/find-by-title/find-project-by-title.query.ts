import { IQuery } from '@nestjs/cqrs';

export class FindProjectByTitleQuery implements IQuery {
  constructor(public readonly title: string) {}
}
