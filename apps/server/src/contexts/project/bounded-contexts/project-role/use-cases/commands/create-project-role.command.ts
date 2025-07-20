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

export class CreateProjectRoleCommand implements ICommand {
  constructor(
    public readonly props: {
      projectId: string;
      userId: string;
      title: string;
      description: string;
      isFilled: boolean;
      techStacks: string[];
    },
  ) {}
}

@CommandHandler(CreateProjectRoleCommand)
export class CreateProjectRoleCommandHandler
  implements ICommandHandler<CreateProjectRoleCommand>
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
    command: CreateProjectRoleCommand,
  ): Promise<Result<ProjectRole, ProjectRoleValidationErrors | string>> {
    const { projectId, userId, title, description, isFilled, techStacks } =
      command.props;

    const techStacksValidation = await this.techStackRepo.findByIds(techStacks);
    if (!techStacksValidation.success) {
      return Result.fail(techStacksValidation.error);
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
      return Result.fail('You are not allowed to add roles to this project');
    }

    // Créer l'entité ProjectRole
    const projectRoleResult = project.createRole({
      title,
      description,
      isFilled,
      techStacks: techStacksValidation.value.map((ts) => ts.toPrimitive()),
    });

    if (!projectRoleResult.success) {
      return Result.fail(projectRoleResult.error);
    }

    // Sauvegarder le rôle
    const saveResult: Result<ProjectRole, string> =
      await this.projectRoleRepo.create(projectRoleResult.value);
    if (!saveResult.success) {
      return Result.fail(saveResult.error);
    }

    return Result.ok(saveResult.value);
  }
}
