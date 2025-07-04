import {
  Project,
  ProjectValidationErrors,
} from '@/contexts/project/domain/project.entity';
import { Result } from '@/libs/result';
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
  // ProjectRoleValidationErrors,
} from '@/contexts/project-role/domain/project-role.entity';
import {
  TECHSTACK_REPOSITORY_PORT,
  TechStackRepositoryPort,
} from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import {
  GITHUB_REPOSITORY_PORT,
  GithubRepositoryPort,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import { Octokit } from '@octokit/rest';
import { GithubRepositoryDto } from '@/contexts/github/infrastructure/repositories/dto/github-repository.dto';
// import { TechStackValidationErrors } from '@/contexts/techstack/domain/techstack.entity';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly props: {
      ownerId: string;
      title: string;
      shortDescription: string;
      description: string;
      techStacks: { id: string; name: string; iconUrl: string }[];
      externalLinks?: { type: string; url: string }[];
      projectRoles: {
        // id: string;
        title: string;
        description: string;
        isFilled: boolean;
        techStacks: { id: string; name: string; iconUrl: string }[];
      }[];
      octokit: Octokit;
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
    @Inject(GITHUB_REPOSITORY_PORT)
    private readonly githubRepository: GithubRepositoryPort,
  ) {}

  async execute(
    createProjectCommand: CreateProjectCommand,
  ): Promise<Result<Project, ProjectValidationErrors | string>> {
    // const errors: CreateProjectCommandErrors = {};
    const {
      ownerId,
      title,
      shortDescription,
      description,
      externalLinks,
      techStacks,
      projectRoles,
      octokit,
    } = createProjectCommand.props;
    // Récupérer tous les IDs des techStacks du projet
    // verifier si un project n'existe pas déjà avec le même titre
    const projectWithSameTitle = await this.projectRepo.findByTitle(title);
    console.log('projectWithSameTitle', projectWithSameTitle);
    if (projectWithSameTitle.success) {
      // errors.project = 'Project with same title already exists';
      return Result.fail('Project with same title already exists');
    }
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
    if (!project.success) {
      return Result.fail(project.error);
    }

    const savedProject = await this.projectRepo.create(project.value);
    if (!savedProject.success) return Result.fail(savedProject.error);

    const githubRepositoryResult: Result<GithubRepositoryDto, string> =
      await this.githubRepository.createGithubRepository(
        {
          title: savedProject.value.toPrimitive().title,
          description: savedProject.value.toPrimitive().description,
        },
        octokit,
      );

    if (githubRepositoryResult.success) {
      //TO DO: Voir si on supprime le projet si on a pas de github repository
      const { html_url } = githubRepositoryResult.value;

      console.log('html_url', html_url);
      if (html_url) {
        savedProject.value.addExternalLink({
          type: 'github',
          url: html_url,
        });
        const savedProjectWithGithubLink = await this.projectRepo.update(
          savedProject.value.toPrimitive().id as string,
          savedProject.value,
        );
        if (!savedProjectWithGithubLink.success) {
          return Result.fail(savedProjectWithGithubLink.error);
        }
      }
    }

    // errors.githubRepository = githubRepositoryResult.error;

    if (projectRoles.length > 0) {
      // const roleTechStacks = projectRoles
      //   .flatMap((role) => {
      //     return allTechStacksValidated.filter((ts) =>
      //       role.techStacks.some((rts) => rts.id === ts.toPrimitive().id),
      //     );
      //   })
      //   .map((ts) => ts.toPrimitive());
      const projectRolesResults = await Promise.all(
        projectRoles.map(async (role) => {
          const projectRole = savedProject.value.createProjectRole({
            title: role.title,
            description: role.description,
            isFilled: role.isFilled,
            techStacks: role.techStacks
              .map((ts) =>
                allTechStacksValidated
                  .find((validated) => validated.toPrimitive().id === ts.id)
                  ?.toPrimitive(),
              )
              .filter(Boolean) as {
              id: string;
              name: string;
              iconUrl: string;
            }[],
          });

          if (!projectRole.success) {
            return Result.fail(projectRole.error);
          }

          const projectRoleSaved = await this.projectRoleRepo.create(
            projectRole.value,
          );

          if (!projectRoleSaved.success) {
            return Result.fail(projectRoleSaved.error);
          }

          return Result.ok(projectRoleSaved.value);
        }),
      );

      const failedResult = projectRolesResults.find(
        (result) => !result.success,
      );
      if (failedResult) {
        return Result.fail(failedResult.error);
      }

      const projectRolesSaved = projectRolesResults
        .filter((result) => result.success)
        .map((result) => result.value as ProjectRole);
      const projectRolesAdded =
        savedProject.value.addProjectRoles(projectRolesSaved);

      if (!projectRolesAdded.success) {
        return Result.fail(projectRolesAdded.error);
      }
    }
    return Result.ok(savedProject.value);
  }
}
