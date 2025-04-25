import { ICommand } from '@nestjs/cqrs';
import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';
import { ProjectStatus } from '@prisma/client';
export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly link: string,
    public readonly status: ProjectStatus,
    public readonly techStacks: TechStackDto[],
    public readonly userId: string,
  ) {}
}
