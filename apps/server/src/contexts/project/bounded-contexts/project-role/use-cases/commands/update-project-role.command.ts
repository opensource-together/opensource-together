import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  PROJECT_ROLE_REPOSITORY_PORT,
  ProjectRoleRepositoryPort,
} from '../ports/project-role.repository.port';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import {
  ProjectRole,
  ProjectRoleValidationErrors,
} from '../../domain/project-role.entity';
import { Project } from '@/contexts/project/domain/project.entity';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { TechStackRepositoryPort } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';

export class UpdateProjectRoleCommand implements ICommand {
  constructor(
    public readonly roleId: string,
    public readonly projectId: string,
    public readonly userId: string,
    public readonly props: {
      title?: string;
      description?: string;
      techStacks?: string[];
    },
  ) {}
}

@CommandHandler(UpdateProjectRoleCommand)
export class UpdateProjectRoleCommandHandler
  implements ICommandHandler<UpdateProjectRoleCommand>
{
  constructor(
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepo: ProjectRoleRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepo: TechStackRepositoryPort,
  ) {}

  async execute(
    command: UpdateProjectRoleCommand,
  ): Promise<Result<ProjectRole, ProjectRoleValidationErrors | string>> {
    const { roleId, projectId, userId, props } = command;

    // Vérifier que le rôle existe
    const existingRoleResult: Result<ProjectRole, string> =
      await this.projectRoleRepo.findById(roleId);
    if (!existingRoleResult.success) {
      return Result.fail('Project role not found');
    }
    const existingRole = existingRoleResult.value;

    // Vérifier que le rôle appartient au projet spécifié
    if (existingRole.toPrimitive().projectId !== projectId) {
      return Result.fail('Project role does not belong to this project');
    }

    // Vérifier que le projet existe et récupérer le projet
    const projectExistResult: Result<Project, string> =
      await this.projectRepo.findById(projectId);
    if (!projectExistResult.success) {
      return Result.fail('Project not found');
    }
    const project: Project = projectExistResult.value;

    // Vérifier que l'utilisateur peut modifier les rôles du projet
    if (!project.canUserModifyRoles(userId)) {
      return Result.fail('You are not allowed to update roles in this project');
    }

    // Valider les techStacks si fournis
    let validatedTechStacks: TechStack[] | undefined;
    if (props.techStacks) {
      const techStacksValidation = await this.techStackRepo.findByIds(
        props.techStacks,
      );
      if (!techStacksValidation.success) {
        return Result.fail(String(techStacksValidation.error));
      }
      validatedTechStacks = techStacksValidation.value;
    }

    // Mettre à jour le rôle
    const updateResult = existingRole.updateRole({
      title: props.title,
      description: props.description,
      techStacks: validatedTechStacks,
    });

    if (!updateResult.success) {
      return Result.fail(updateResult.error);
    }

    // Sauvegarder les modifications
    const saveResult: Result<ProjectRole, string> =
      await this.projectRoleRepo.update(existingRole);
    if (!saveResult.success) {
      return Result.fail(saveResult.error);
    }

    return Result.ok(saveResult.value);
  }
}
