import { ICommand } from '@nestjs/cqrs';
import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly link: string | null,
    public readonly status: string,
    public readonly techStacks: TechStackDto[],
    public readonly userId: string,
  ) {}
}
