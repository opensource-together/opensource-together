import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/shared/result';
import { ProjectRepositoryPort } from '@/contexts/project/use-cases/ports/project.repository.port';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { ProjectRoleRepositoryPort } from '@/contexts/project/use-cases/ports/projectRole.repository.port';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/projectRole.repository.port';
import { ProjectRole } from '@/domain/projectRole/projectRole.entity';
import { TechStackDto } from '@/contexts/project/infrastructure/controllers/dto/TechStackDto.request';
import { CreateProjectRoleInputsDto } from '@/application/dto/inputs/create-project-role-inputs.dto';

export class CreateProjectRoleCommand {
  constructor(
    public readonly projectId: string,
    public readonly ownerId: string,
    public readonly roleTitle: string,
    public readonly description: string,
    public readonly isFilled: boolean,
    public readonly skillSet: TechStackDto[],
  ) {}
}

@Injectable()
@CommandHandler(CreateProjectRoleCommand)
export class CreateProjectRoleHandler
  implements ICommandHandler<CreateProjectRoleCommand>
{
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepository: ProjectRoleRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(
    command: CreateProjectRoleCommand,
  ): Promise<Result<ProjectRole>> {
    const { projectId, ownerId, roleTitle, description, isFilled, skillSet } =
      command;

    // Vérifier que le projet existe et appartient à l'utilisateur
    const projectResult =
      await this.projectRepository.findProjectById(projectId);
    if (!projectResult.success) {
      return Result.fail(projectResult.error);
    }

    if (!projectResult.value) {
      return Result.fail('Project not found');
    }

    const project = projectResult.value;
    if (project.getOwnerId() !== ownerId) {
      return Result.fail('You are not allowed to add roles to this project');
    }

    // Créer le projectRole
    const payload: CreateProjectRoleInputsDto = {
      projectId,
      roleTitle,
      description,
      isFilled,
      skillSet,
    };

    return this.projectRoleRepository.createProjectRole(payload);
  }
}
