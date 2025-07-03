import {
  Project,
  ProjectValidationErrors,
} from '@/contexts/project/domain/project.entity';
import { Result } from '@/shared/result';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import { ProjectRoleRepositoryPort } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import {
  ProjectRole,
  ProjectRoleValidationErrors,
} from '@/contexts/project-role/domain/project-role.entity';
import {
  TECHSTACK_REPOSITORY_PORT,
  TechStackRepositoryPort,
} from '@/contexts/techstack/use-cases/ports/techstack.repository.port';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly props: {
      ownerId: string;
      title: string;
      shortDescription: string;
      description: string;
      externalLinks: { type: string; url: string }[];
      techStacks: { id: string; name: string; iconUrl: string }[];
      projectRoles: {
        // id: string;
        title: string;
        description: string;
        isFilled: boolean;
        techStacks: { id: string; name: string; iconUrl: string }[];
      }[];
    },
  ) {}
}

@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepo: ProjectRoleRepositoryPort,
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepo: TechStackRepositoryPort,
  ) {}

  async execute(
    createProjectCommand: CreateProjectCommand,
  ): Promise<
    Result<
      Project,
      ProjectValidationErrors | string | ProjectRoleValidationErrors
    >
  > {
    const {
      ownerId,
      title,
      shortDescription,
      description,
      externalLinks,
      techStacks,
      projectRoles,
    } = createProjectCommand.props;
    // Récupérer tous les IDs des techStacks du projet
    const projectTechStackIds = techStacks.map((ts) => ts.id);

    // Récupérer tous les IDs des techStacks des projectRoles
    const roleTechStackIds = projectRoles.flatMap((role) =>
      role.techStacks.map((ts) => ts.id),
    );

    // Combiner tous les IDs uniques
    const allTechStackIds = [
      ...new Set([...projectTechStackIds, ...roleTechStackIds]),
    ];
    const techStacksValidation =
      await this.techStackRepo.findByIds(allTechStackIds);
    if (!techStacksValidation.success) {
      return Result.fail(techStacksValidation.error);
    }
    const allTechStacksValidated = techStacksValidation.value;

    if (allTechStacksValidated.length !== allTechStackIds.length)
      return Result.fail('Tech stacks not found');
    const project = Project.create({
      ownerId,
      title,
      shortDescription,
      description,
      externalLinks,
      techStacks: allTechStacksValidated.map((ts) => ts.toPrimitive()),
      projectRoles: [],
    });
    if (!project.success) return Result.fail(project.error);

    const savedProject = await this.projectRepo.create(project.value);
    if (!savedProject.success) return Result.fail(savedProject.error);

    if (projectRoles.length > 0) {
      const roleTechStacks = projectRoles
        .flatMap((role) => {
          return allTechStacksValidated.filter((ts) =>
            role.techStacks.some((rts) => rts.id === ts.toPrimitive().id),
          );
        })
        .map((ts) => ts.toPrimitive());
      const projectRolesCreated = await Promise.all(
        projectRoles.map(async (role) => {
          const projectRole = savedProject.value.createProjectRole({
            title: role.title,
            description: role.description,
            isFilled: role.isFilled,
            techStacks: roleTechStacks,
          });
          if (!projectRole.success) return Result.fail(projectRole.error);
          return await this.projectRoleRepo.create(projectRole.value);
        }),
      );
      if (!projectRolesCreated.every((r) => r.success))
        return Result.fail(
          projectRolesCreated.find((r) => !r.success)?.error as
            | ProjectRoleValidationErrors
            | string,
        );
      const projectRolesSaved = projectRolesCreated.map(
        (r) => r.value,
      ) as ProjectRole[];
      const projectRolesAdded =
        savedProject.value.addProjectRoles(projectRolesSaved);
      if (!projectRolesAdded.success)
        return Result.fail(projectRolesAdded.error);
    }
    return Result.ok(savedProject.value);
  }
}
