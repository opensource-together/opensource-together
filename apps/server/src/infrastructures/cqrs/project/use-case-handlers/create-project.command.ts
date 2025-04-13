import { ICommand } from '@nestjs/cqrs';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly link: string | null,
    public readonly status: 'PUBLISHED',
    public readonly techStacks: string[],
    public readonly userId: string,
  ) {}
}
