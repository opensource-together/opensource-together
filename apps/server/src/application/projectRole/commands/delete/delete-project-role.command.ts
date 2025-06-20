import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/shared/result';
import {
  ProjectRoleRepositoryPort,
  PROJECT_ROLE_REPOSITORY_PORT,
} from '@/application/project/ports/projectRole.repository.port';
import {
  ProjectRepositoryPort,
  PROJECT_REPOSITORY_PORT,
} from '@/application/project/ports/project.repository.port';

export class DeleteProjectRoleCommand {
  constructor(
    public readonly projectId: string,
    public readonly roleId: string,
    public readonly ownerId: string,
  ) {}
}

@Injectable()
@CommandHandler(DeleteProjectRoleCommand)
export class DeleteProjectRoleHandler
  implements ICommandHandler<DeleteProjectRoleCommand>
{
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepository: ProjectRoleRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(command: DeleteProjectRoleCommand): Promise<Result<boolean>> {
    const { projectId, roleId, ownerId } = command;

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
      return Result.fail(
        'You are not allowed to delete roles from this project',
      );
    }

    // Vérifier que le rôle appartient au projet
    const projectRoles = project.getProjectRoles();
    const roleExists = projectRoles.some((role) => role.getId() === roleId);
    if (!roleExists) {
      return Result.fail('Role not found in this project');
    }

    // Supprimer le rôle
    return this.projectRoleRepository.deleteProjectRoleById(roleId);
  }
}
