import { IQuery } from '@nestjs/cqrs';

export class findProjectByTitleQuery implements IQuery {
  constructor(public readonly title: string) {}
}
