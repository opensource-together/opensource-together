import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import {
  PROJECT_ROLE_REPOSITORY_PORT,
  ProjectRoleRepositoryPort,
} from '../ports/project-role.repository.port';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';

export class DeleteProjectRoleCommand implements ICommand {
  constructor(
    public readonly roleId: string,
    public readonly projectId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteProjectRoleCommand)
export class DeleteProjectRoleCommandHandler
  implements ICommandHandler<DeleteProjectRoleCommand>
{
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepo: ProjectRoleRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(
    command: DeleteProjectRoleCommand,
  ): Promise<Result<boolean, string>> {
    const { roleId, projectId, userId } = command;

    // Vérifier que le rôle existe
    const existingRoleResult = await this.projectRoleRepo.findById(roleId);
    if (!existingRoleResult.success) {
      return Result.fail('Project role not found');
    }
    const existingRole = existingRoleResult.value;

    // Vérifier que le rôle appartient au projet spécifié
    if (existingRole.toPrimitive().projectId !== projectId) {
      return Result.fail('Project role does not belong to this project');
    }

    // Vérifier que le projet existe et récupérer le projet
    const projectExistResult = await this.projectRepo.findById(projectId);
    if (!projectExistResult.success) {
      return Result.fail('Project not found');
    }
    const project = projectExistResult.value;

    // Vérifier que l'utilisateur peut supprimer les rôles du projet
    if (!project.canUserModifyRoles(userId)) {
      return Result.fail('You are not allowed to delete roles in this project');
    }

    // Supprimer le rôle
    const deleteResult = await this.projectRoleRepo.delete(roleId);
    if (!deleteResult.success) {
      return Result.fail(String(deleteResult.error));
    }

    return Result.ok(true);
  }
}
