import { ICommand } from '@nestjs/cqrs';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly link: string,
    public readonly status: 'PUBLISHED' | 'DRAFT',
    public readonly techStacks: string[],
    public readonly userId: string,
  ) {}
}
