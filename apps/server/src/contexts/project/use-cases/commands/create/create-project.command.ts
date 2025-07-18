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
import { CATEGORY_REPOSITORY_PORT } from '@/contexts/category/use-cases/ports/category.repository.port';
import { CategoryRepositoryPort } from '@/contexts/category/use-cases/ports/category.repository.port';
import { Category } from '@/contexts/category/domain/category.entity';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly props: {
      ownerId: string;
      title: string;
      shortDescription: string;
      description: string;
      techStacks: string[];
      externalLinks?: { type: string; url: string }[];
      projectRoles: {
        title: string;
        description: string;
        techStacks: string[];
      }[];
      categories: string[];
      keyFeatures: { id?: string; feature: string }[];
      projectGoals: { id?: string; goal: string }[];
      octokit: Octokit;
      image?: string;
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
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepo: TechStackRepositoryPort,
    @Inject(GITHUB_REPOSITORY_PORT)
    private readonly githubRepository: GithubRepositoryPort,
    @Inject(CATEGORY_REPOSITORY_PORT)
    private readonly categoryRepo: CategoryRepositoryPort,
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
      categories,
      keyFeatures,
      projectGoals,
      octokit,
      image,
    } = createProjectCommand.props;
    // verifier si un project n'existe pas déjà avec le même titre
    const projectWithSameTitle = await this.projectRepo.findByTitle(title);
    if (projectWithSameTitle.success) {
      return Result.fail('Project with same title already exists');
    }
    const projectTechStackIds = techStacks;
    // Récupérer tous les IDs des techStacks des projectRoles
    const roleTechStackIds = projectRoles.flatMap((role) => role.techStacks);
    // Combiner tous les IDs uniques
    const allTechStackIds = [
      ...new Set([...projectTechStackIds, ...roleTechStackIds]),
    ];
    //vérifier si les techStacks existent et son valide
    //TODO: Voir si on peut déplacer cette logique ailleurs ulterieurement
    const techStacksValidation =
      await this.techStackRepo.findByIds(allTechStackIds);
    if (!techStacksValidation.success) {
      return Result.fail(techStacksValidation.error);
    }
    const allTechStacksValidated = techStacksValidation.value;

    if (allTechStacksValidated.length !== allTechStackIds.length)
      return Result.fail('Some tech stacks are not valid');

    const categoriesValidation: Result<Category[], string> =
      await this.categoryRepo.findByIds(categories);
    if (!categoriesValidation.success) {
      return Result.fail('Some categories are not valid');
    }
    const allCategoriesValidated = categoriesValidation.value;

    //ont créer un project pour valider des regles métier
    console.log('image create project commands', image);
    const projectResult = Project.create({
      ownerId,
      title,
      shortDescription,
      description,
      externalLinks,
      categories: allCategoriesValidated.map((c) => c.toPrimitive()),
      techStacks: allTechStacksValidated.map((ts) => ts.toPrimitive()),
      projectRoles: projectRoles.map((role) => ({
        title: role.title,
        description: role.description,
        isFilled: false,
        techStacks: role.techStacks.map((ts) => ({
          id: ts,
          name: allTechStacksValidated
            .find((t) => t.toPrimitive().id === ts)
            ?.toPrimitive().name as string,
          iconUrl: allTechStacksValidated
            .find((t) => t.toPrimitive().id === ts)
            ?.toPrimitive().iconUrl as string,
        })),
      })),
      keyFeatures: keyFeatures,
      projectGoals: projectGoals,
      image,
    });
    if (!projectResult.success) {
      return Result.fail(projectResult.error);
    }

    const projectValidated = projectResult.value;
    //si valide alors on enregistre le projet dans la persistance
    const savedProject = await this.projectRepo.create(projectValidated);
    if (!savedProject.success) return Result.fail('Unable to create project');

    //si le projet est valide alors on créer un github repository
    //TODO: Voir si on peut déplacer cette logique ailleurs ulterieurement
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

      if (html_url) {
        //on ajoute le lien github au projet
        savedProject.value.addExternalLink({
          type: 'github',
          url: html_url,
        });
        //on met à jour le projet avec le lien github dans la persistance
        const savedProjectWithGithubLink = await this.projectRepo.update(
          savedProject.value.toPrimitive().id as string,
          savedProject.value,
        );
        if (!savedProjectWithGithubLink.success) {
          //si une erreur survient, on renvoie quand meme le projet créé
          return Result.ok(savedProject.value);
        }
      }
    }
    //on retourne le projet avec les roles ajoutés
    return Result.ok(savedProject.value);
  }
}
