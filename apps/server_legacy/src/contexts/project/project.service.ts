import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from './use-cases/ports/project.repository.port';
import { Octokit } from '@octokit/rest';
import { TECHSTACK_REPOSITORY_PORT } from '../techstack/use-cases/ports/techstack.repository.port';
import { GITHUB_REPOSITORY_PORT } from '../github/use-cases/ports/github-repository.port';
import {
  CATEGORY_REPOSITORY_PORT,
  CategoryRepositoryPort,
} from '../category/use-cases/ports/category.repository.port';
import { TechStackRepositoryPort } from '../techstack/use-cases/ports/techstack.repository.port';
import { GithubRepositoryPort } from '../github/use-cases/ports/github-repository.port';
import { Result } from '@/libs/result';
import { Category } from '../category/domain/category.entity';
import { Project, ProjectValidationErrors } from './domain/project.entity';
import { GithubRepositoryDto } from '../github/infrastructure/repositories/dto/github-repository.dto';
import { CreateProjectDto } from './controllers/dto/create-project-request.dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepo: TechStackRepositoryPort,
    @Inject(GITHUB_REPOSITORY_PORT)
    private readonly githubRepository: GithubRepositoryPort,
    @Inject(CATEGORY_REPOSITORY_PORT)
    private readonly categoryRepo: CategoryRepositoryPort,
  ) {}

  async create(
    props: CreateProjectDto & {
      ownerId: string;
      octokit: Octokit;
      method: string;
    },
  ): Promise<Result<Project, string | ProjectValidationErrors>> {
    // const errors: CreateProjectCommandErrors = {};
    const { ownerId, title, ...createProjectDto } = props;
    // verifier si un project n'existe pas déjà avec le même titre
    const projectWithSameTitle =
      await this.projectRepository.findByTitle(title);
    if (projectWithSameTitle.success) {
      return Result.fail('Project with same title already exists');
    }
    const projectTechStackIds = createProjectDto.techStacks;
    // Récupérer tous les IDs des techStacks des projectRoles
    const roleTechStackIds = createProjectDto.projectRoles.flatMap(
      (role) => role.techStacks,
    );
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
      await this.categoryRepo.findByIds(createProjectDto.categories);
    if (!categoriesValidation.success) {
      return Result.fail('Some categories are not valid');
    }
    const allCategoriesValidated = categoriesValidation.value;

    //ont créer un project pour valider des regles métier
    const projectResult = Project.create({
      ownerId: ownerId,
      title,
      shortDescription: createProjectDto.shortDescription,
      description: createProjectDto.description,
      externalLinks: createProjectDto.externalLinks,
      categories: allCategoriesValidated.map((c) => c.toPrimitive()),
      techStacks: projectTechStacks.map((ts) => ts.toPrimitive()),
      projectRoles: createProjectDto.projectRoles.map((role) => ({
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
      keyFeatures: createProjectDto.keyFeatures.map((feature) => ({
        feature: feature,
      })),
      projectGoals: createProjectDto.projectGoals.map((goal) => ({
        goal: goal,
      })),
    });
    if (!projectResult.success) {
      return Result.fail(projectResult.error);
    }

    const projectValidated = projectResult.value;
    //si valide alors on enregistre le projet dans la persistance
    let savedProject = await this.projectRepository.create(projectValidated);
    if (!savedProject.success) return Result.fail('Unable to create project');

    switch (props.method) {
      //si le projet est valide alors on créer un github repository
      //TODO: Voir si on peut déplacer cette logique ailleurs ulterieurement
      //on retourne le projet avec les roles ajoutés
      case 'scratch':
        savedProject = await this.createGithubRepository(
          savedProject.value,
          props.octokit,
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

  async update(props: {
    id: string;
    ownerId: string;
    projectProps: {
      title?: string;
      description?: string;
      shortDescription?: string;
      externalLinks?: { type: string; url: string }[];
      techStacks?: string[];
      categories?: string[];
      keyFeatures?: (string | { id: string; feature: string })[];
      projectGoals?: (string | { id: string; goal: string })[];
      image?: string;
      coverImages?: string[];
      readme?: string;
    };
  }): Promise<Result<Project, string | ProjectValidationErrors>> {
    const { id, ownerId, projectProps } = props;

    // Vérifier que le projet existe et récupérer ses détails
    const existingProjectResult = await this.projectRepository.findById(id);
    if (!existingProjectResult.success) {
      return Result.fail('Project not found');
    }

    const existingProject = existingProjectResult.value;

    // Vérifier que l'utilisateur est bien le propriétaire du projet
    if (!existingProject.hasOwnerId(ownerId)) {
      return Result.fail('You are not allowed to update this project');
    }

    // Validation des techStacks si fournis
    let allTechStacksValidated = existingProject.toPrimitive().techStacks;
    if (projectProps.techStacks) {
      const techStacksValidation = await this.techStackRepo.findByIds(
        projectProps.techStacks,
      );
      if (!techStacksValidation.success) {
        return Result.fail(techStacksValidation.error);
      }

      const techStacksValidated = techStacksValidation.value;
      if (techStacksValidated.length !== projectProps.techStacks.length) {
        return Result.fail('Some tech stacks are not valid');
      }

      allTechStacksValidated = techStacksValidated.map((ts) =>
        ts.toPrimitive(),
      );
    }

    // Validation des categories si fournies
    let allCategoriesValidated = existingProject.toPrimitive().categories;
    if (projectProps.categories) {
      const categoriesValidation: Result<Category[], string> =
        await this.categoryRepo.findByIds(projectProps.categories);
      if (!categoriesValidation.success) {
        return Result.fail('Some categories are not valid');
      }

      allCategoriesValidated = categoriesValidation.value.map((c) =>
        c.toPrimitive(),
      );
    }

    // Préparer les données pour la mise à jour
    const existingData = existingProject.toPrimitive();

    // Gestion incrémentale des keyFeatures
    let updatedKeyFeatures = existingData.keyFeatures;
    if (projectProps.keyFeatures) {
      const existingKeyFeatures = existingData.keyFeatures;
      const incomingKeyFeatures = projectProps.keyFeatures;

      // Séparer les strings (nouvelles) et les objets (existants à modifier)
      const newKeyFeatures = incomingKeyFeatures
        .filter((item): item is string => typeof item === 'string')
        .map((feature) => ({ feature }));

      const existingKeyFeaturesToUpdate = incomingKeyFeatures.filter(
        (item): item is { id: string; feature: string } =>
          typeof item === 'object' && 'id' in item,
      );

      // Identifier les keyFeatures existantes à conserver (avec ID dans la liste)
      const keyFeaturesToKeep = existingKeyFeatures.filter((existing) =>
        existingKeyFeaturesToUpdate.some(
          (incoming) => incoming.id === existing.id,
        ),
      );

      // Mettre à jour les keyFeatures existantes
      const updatedExistingKeyFeatures = keyFeaturesToKeep.map((existing) => {
        const update = existingKeyFeaturesToUpdate.find(
          (incoming) => incoming.id === existing.id,
        );
        return update ? { ...existing, feature: update.feature } : existing;
      });

      updatedKeyFeatures = [...updatedExistingKeyFeatures, ...newKeyFeatures];
    }

    // Gestion incrémentale des projectGoals
    let updatedProjectGoals = existingData.projectGoals;
    if (projectProps.projectGoals) {
      // Séparer les strings (nouvelles) et les objets (existants à modifier)
      const newProjectGoals = projectProps.projectGoals
        .filter((item): item is string => typeof item === 'string')
        .map((goal) => ({ goal }));

      const existingProjectGoalsToUpdate = projectProps.projectGoals.filter(
        (item): item is { id: string; goal: string } =>
          typeof item === 'object' && 'id' in item,
      );

      // Identifier les projectGoals existantes à conserver (avec ID dans la liste)
      const projectGoalsToKeep = existingData.projectGoals.filter((existing) =>
        existingProjectGoalsToUpdate.some(
          (incoming) => incoming.id === existing.id,
        ),
      );

      // Mettre à jour les projectGoals existantes
      const updatedExistingProjectGoals = projectGoalsToKeep.map((existing) => {
        const update = existingProjectGoalsToUpdate.find(
          (incoming) => incoming.id === existing.id,
        );
        return update ? { ...existing, goal: update.goal } : existing;
      });

      updatedProjectGoals = [
        ...updatedExistingProjectGoals,
        ...newProjectGoals,
      ];
    }

    const updatedData = {
      ...existingData,
      title: projectProps.title ?? existingData.title,
      description: projectProps.description ?? existingData.description,
      shortDescription:
        projectProps.shortDescription ?? existingData.shortDescription,
      externalLinks: projectProps.externalLinks ?? existingData.externalLinks,
      techStacks: allTechStacksValidated,
      categories: allCategoriesValidated,
      keyFeatures: updatedKeyFeatures,
      projectGoals: updatedProjectGoals,
      image: projectProps.image ?? existingData.image,
      coverImages: projectProps.coverImages ?? existingData.coverImages,
      readme: projectProps.readme ?? existingData.readme,
    };

    // Valider les données mises à jour
    const updatedProjectResult = Project.reconstitute(updatedData);
    if (!updatedProjectResult.success) {
      return Result.fail(updatedProjectResult.error);
    }

    const updatedProject = updatedProjectResult.value;

    // Sauvegarder les modifications
    const saveResult = await this.projectRepository.update(id, updatedProject);
    if (!saveResult.success) {
      return Result.fail('Unable to update project');
    }

    return Result.ok(saveResult.value);
  }

  async delete(props: {
    projectId: string;
    ownerId: string;
  }): Promise<Result<boolean, string>> {
    const { projectId, ownerId } = props;

    // Vérifier que le projet existe et récupérer ses détails
    const projectResult = await this.projectRepository.findById(projectId);
    if (!projectResult.success) {
      return Result.fail('Project not found');
    }

    const project = projectResult.value;

    // Vérifier que l'utilisateur est bien le propriétaire du projet
    if (!project.hasOwnerId(ownerId)) {
      return Result.fail('You are not allowed to delete this project');
    }

    // Supprimer le projet
    const deleteResult = await this.projectRepository.delete(projectId);
    if (!deleteResult.success) {
      return Result.fail(deleteResult.error);
    }

    return Result.ok(true);
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
    const savedProjectWithGithubLink = await this.projectRepository.update(
      project.toPrimitive().id as string,
      project,
    );
    return savedProjectWithGithubLink;
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
}
