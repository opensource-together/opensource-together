import { Category } from '@/contexts/category/domain/category.entity';
import {
  CATEGORY_REPOSITORY_PORT,
  CategoryRepositoryPort,
} from '@/contexts/category/use-cases/ports/category.repository.port';
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
import {
  MEDIA_SERVICE_PORT,
  MediaServicePort,
} from '@/media/port/media.service.port';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

export class UpdateProjectCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public readonly props: {
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
    },
  ) {}
}

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectCommandHandler
  implements ICommandHandler<UpdateProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepo: TechStackRepositoryPort,
    @Inject(CATEGORY_REPOSITORY_PORT)
    private readonly categoryRepo: CategoryRepositoryPort,
    @Inject(MEDIA_SERVICE_PORT)
    private readonly mediaService: MediaServicePort,
  ) {}

  async execute(
    command: UpdateProjectCommand,
  ): Promise<Result<Project, ProjectValidationErrors | string>> {
    const { id, ownerId, props } = command;

    // Vérifier que le projet existe et récupérer ses détails
    const existingProjectResult = await this.projectRepo.findById(id);
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
    if (props.techStacks) {
      const techStacksValidation = await this.techStackRepo.findByIds(
        props.techStacks,
      );
      if (!techStacksValidation.success) {
        return Result.fail(techStacksValidation.error);
      }

      const techStacksValidated = techStacksValidation.value;
      if (techStacksValidated.length !== props.techStacks.length) {
        return Result.fail('Some tech stacks are not valid');
      }

      allTechStacksValidated = techStacksValidated.map((ts) =>
        ts.toPrimitive(),
      );
    }

    // Validation des categories si fournies
    let allCategoriesValidated = existingProject.toPrimitive().categories;
    if (props.categories) {
      const categoriesValidation: Result<Category[], string> =
        await this.categoryRepo.findByIds(props.categories);
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
    if (props.keyFeatures) {
      const existingKeyFeatures = existingData.keyFeatures;
      const incomingKeyFeatures = props.keyFeatures;

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
    if (props.projectGoals) {
      // Séparer les strings (nouvelles) et les objets (existants à modifier)
      const newProjectGoals = props.projectGoals
        .filter((item): item is string => typeof item === 'string')
        .map((goal) => ({ goal }));

      const existingProjectGoalsToUpdate = props.projectGoals.filter(
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
      title: props.title ?? existingData.title,
      description: props.description ?? existingData.description,
      shortDescription: props.shortDescription ?? existingData.shortDescription,
      externalLinks: props.externalLinks ?? existingData.externalLinks,
      techStacks: allTechStacksValidated,
      categories: allCategoriesValidated,
      keyFeatures: updatedKeyFeatures,
      projectGoals: updatedProjectGoals,
      image: props.image ?? existingData.image,
      coverImages: props.coverImages ?? existingData.coverImages,
      readme: props.readme ?? existingData.readme,
    };

    // Valider les données mises à jour
    const updatedProjectResult = Project.reconstitute(updatedData);
    if (!updatedProjectResult.success) {
      return Result.fail(updatedProjectResult.error);
    }

    const updatedProject = updatedProjectResult.value;

    // Sauvegarder les modifications
    const saveResult = await this.projectRepo.update(id, updatedProject);
    if (!saveResult.success) {
      return Result.fail('Unable to update project');
    }

    return Result.ok(saveResult.value);
  }
}
