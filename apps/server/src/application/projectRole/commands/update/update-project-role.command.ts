import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ProjectRepositoryPort,
  PROJECT_REPOSITORY_PORT,
} from '@/application/project/ports/project.repository.port';
import {
  ProjectRoleRepositoryPort,
  PROJECT_ROLE_REPOSITORY_PORT,
} from '@/application/project/ports/projectRole.repository.port';
import { Result } from '@/shared/result';
import { Injectable, Inject } from '@nestjs/common';
import { ProjectRole } from '@/domain/projectRole/projectRole.entity';
import { UpdateProjectRoleInputsDto } from '@/application/dto/inputs/update-project-role-inputs.dto';

export class UpdateProjectRoleCommand {
  constructor(
    public readonly projectId: string,
    public readonly roleId: string,
    public readonly ownerId: string,
    public readonly payload: UpdateProjectRoleInputsDto,
  ) {}
}

@Injectable()
@CommandHandler(UpdateProjectRoleCommand)
export class UpdateProjectRoleHandler
  implements ICommandHandler<UpdateProjectRoleCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepository: ProjectRoleRepositoryPort,
  ) {}

  async execute(
    command: UpdateProjectRoleCommand,
  ): Promise<Result<ProjectRole>> {
    const { projectId, roleId, ownerId, payload } = command;

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
      return Result.fail('You are not allowed to update this project role');
    }

    // Vérifier que le rôle appartient au projet
    const projectRoles = project.getProjectRoles();
    const roleExists = projectRoles.some((role) => role.getId() === roleId);
    if (!roleExists) {
      return Result.fail('Role not found in this project');
    }

    // Mettre à jour le rôle
    const updateResult = await this.projectRoleRepository.updateProjectRoleById(
      projectId,
      roleId,
      ownerId,
      payload,
    );

    return updateResult;
  }
}
