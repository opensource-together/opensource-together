import { Category } from '@/contexts/category/domain/category.entity';
import {
  CATEGORY_REPOSITORY_PORT,
  CategoryRepositoryPort,
} from '@/contexts/category/use-cases/ports/category.repository.port';
import { GithubRepositoryDto } from '@/contexts/github/infrastructure/repositories/dto/github-repository.dto';
import {
  GITHUB_REPOSITORY_PORT,
  GithubRepositoryPort,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import {
  Project,
  ProjectValidationErrors,
} from '@/contexts/project/domain/project.entity';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import {
  TECHSTACK_REPOSITORY_PORT,
  TechStackRepositoryPort,
} from '@/contexts/techstack/use-cases/ports/techstack.repository.port';

import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Octokit } from '@octokit/rest';

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
      method: string;
      image?: string;
      coverImages?: string[];
      readme?: string;
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
      method,
      image,
      coverImages,
      readme,
    } = createProjectCommand.props;
    // verifier si un project n'existe pas déjà avec le même titre
    const projectWithSameTitle = await this.projectRepo.findByTitle(title);
    if (projectWithSameTitle.success) {
      return Result.fail('Project with same title already exists');
    }
    const projectTechStackIds = techStacks;
    // Récupérer tous les IDs des techStacks des projectRoles
    const roleTechStackIds = projectRoles.flatMap((role) => role.techStacks);
    // Combiner tous les IDs uniques pour la validation uniquement
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

    // Séparer les technologies du projet et des rôles
    const projectTechStacks = allTechStacksValidated.filter((tech) =>
      projectTechStackIds.includes(tech.toPrimitive().id),
    );

    const categoriesValidation: Result<Category[], string> =
      await this.categoryRepo.findByIds(categories);
    if (!categoriesValidation.success) {
      return Result.fail('Some categories are not valid');
    }
    const allCategoriesValidated = categoriesValidation.value;

    //ont créer un project pour valider des regles métier
    const projectResult = Project.create({
      ownerId: ownerId,
      title,
      shortDescription,
      description,
      externalLinks,
      categories: allCategoriesValidated.map((c) => c.toPrimitive()),
      techStacks: projectTechStacks.map((ts) => ts.toPrimitive()),
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
          type: allTechStacksValidated
            .find((t) => t.toPrimitive().id === ts)
            ?.toPrimitive().type as 'LANGUAGE' | 'TECH',
        })),
      })),
      keyFeatures: keyFeatures,
      projectGoals: projectGoals,
      image,
      coverImages,
      readme,
    });
    if (!projectResult.success) {
      return Result.fail(projectResult.error);
    }

    const projectValidated = projectResult.value;
    //si valide alors on enregistre le projet dans la persistance
    let savedProject = await this.projectRepo.create(projectValidated);
    if (!savedProject.success) return Result.fail('Unable to create project');

    switch (method) {
      //si le projet est valide alors on créer un github repository
      //TODO: Voir si on peut déplacer cette logique ailleurs ulterieurement
      //on retourne le projet avec les roles ajoutés
      case 'scratch':
        savedProject = await this.createGithubRepository(
          savedProject.value,
          octokit,
        );
        break;
      //si le projet est créé depuis github, on ne fait rien de plus
      case 'github':
        savedProject = this.validateGithubProject(savedProject.value);
        break;
      default:
        break;
    }

    return savedProject;
  }

  async createGithubRepository(
    project: Project,
    octokit: Octokit,
  ): Promise<Result<Project, string>> {
    const githubRepositoryResult: Result<GithubRepositoryDto, string> =
      await this.githubRepository.createGithubRepository(
        {
          title: project.toPrimitive().title,
          description: project.toPrimitive().description,
        },
        octokit,
      );

    if (githubRepositoryResult.success) {
      //TO DO: Voir si on supprime le projet si on a pas de github repository
      const { html_url } = githubRepositoryResult.value;

      if (html_url) {
        //on ajoute le lien github au projet
        const savedProjectWithGithubLink = await this.addUrlToProject(
          project,
          html_url,
        );
        if (!savedProjectWithGithubLink.success) {
          //si une erreur survient, on renvoie quand meme le projet créé
          return Result.ok(project);
        }
      }
      return Result.ok(project);
    }
    return Result.fail(
      'Unable to create GitHub repository : ' + githubRepositoryResult.error,
    );
  }

  validateGithubProject(project: Project): Result<Project, string> {
    //on vérifie si le projet a un lien github
    const githubLink = project
      .toPrimitive()
      .externalLinks?.find((link) => link.type === 'github');
    if (!githubLink || !githubLink.url) {
      return Result.fail('Project does not have a GitHub link');
    }
    if (!githubLink.url.startsWith('https://github.com')) {
      return Result.fail('Project GitHub link is not a valid repository URL');
    }
    return Result.ok(project);
  }

  async addUrlToProject(
    project: Project,
    url?: string,
  ): Promise<Result<Project, string>> {
    if (!url) {
      return Result.fail('No URL provided to add to project');
    }
    //on ajoute le lien github au projet
    project.addExternalLink({
      type: 'github',
      url,
    });
    //on met à jour le projet avec le lien github dans la persistance
    const savedProjectWithGithubLink = await this.projectRepo.update(
      project.toPrimitive().id as string,
      project,
    );
    return savedProjectWithGithubLink;
  }
}
