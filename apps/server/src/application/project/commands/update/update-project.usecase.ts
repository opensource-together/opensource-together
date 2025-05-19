import { UpdateProjectInputsDto } from '@/application/dto/inputs/update-project-inputs.dto';

import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';
import { ICommandHandler, CommandHandler, ICommand } from '@nestjs/cqrs';
import { ProjectRepositoryPort } from '../../ports/project.repository.port';
import { PROJECT_REPOSITORY_PORT } from '@/application/project/ports/project.repository.port';
import { Inject } from '@nestjs/common';
import { Result } from '@/shared/result';
import { Project } from '@/domain/project/project.entity';
import { Title } from '@/domain/project/title/title.vo';
import { Description } from '@/domain/project/description/description.vo';
import { Link } from '@/domain/project/link/link.vo';

export class UpdateProjectCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly title: string | null,
    public readonly description: string | null,
    public readonly link: string | null,
    public readonly techStacks: TechStackDto[],
    public readonly ownerId: string,
  ) {}
}

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectCommandHandler
  implements ICommandHandler<UpdateProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<Result<Project>> {
    const updatePayload: UpdateProjectInputsDto = {
      title: command.title ? Title.create(command.title) : undefined,
      description: command.description
        ? Description.create(command.description)
        : undefined,
      link: command.link ? Link.create(command.link) : undefined,
      techStacks: command.techStacks,
    };

    const project = await this.projectRepo.updateProjectById(
      command.id,
      updatePayload,
      command.ownerId,
    );

    if (!project.success) {
      return Result.fail(project.error);
    }
    return Result.ok(project.value);
  }
}
