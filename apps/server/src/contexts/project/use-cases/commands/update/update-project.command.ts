import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import {
  Project,
  ProjectValidationErrors,
} from '@/contexts/project/domain/project.entity';
import {
  TECHSTACK_REPOSITORY_PORT,
  TechStackRepositoryPort,
} from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import {
  CATEGORY_REPOSITORY_PORT,
  CategoryRepositoryPort,
} from '@/contexts/category/use-cases/ports/category.repository.port';
import { Category } from '@/contexts/category/domain/category.entity';
import {
  MEDIA_SERVICE_PORT,
  MediaServicePort,
} from '@/media/port/media.service.port';
import {
  PROJECT_KEY_FEATURE_REPOSITORY_PORT,
  ProjectKeyFeatureRepositoryPort,
} from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/ports/project-key-feature.repository.port';
import { KeyFeature } from '@/contexts/project/bounded-contexts/project-key-feature/domain/key-feature.entity';

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
      keyFeatures?: {
        id: string;
        projectId: string;
        feature: string;
      }[];
      projectGoals?: string[];
      projectRoles?: {
        title: string;
        description: string;
        techStacks: string[];
      }[];
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
    @Inject(PROJECT_KEY_FEATURE_REPOSITORY_PORT)
    private readonly keyFeatureRepo: ProjectKeyFeatureRepositoryPort,
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
      // Récupérer tous les IDs des techStacks des projectRoles
      const roleTechStackIds =
        props.projectRoles?.flatMap((role) => role.techStacks) || [];
      // Combiner tous les IDs uniques
      const allTechStackIds = [
        ...new Set([...props.techStacks, ...roleTechStackIds]),
      ];

      const techStacksValidation =
        await this.techStackRepo.findByIds(allTechStackIds);
      if (!techStacksValidation.success) {
        return Result.fail(techStacksValidation.error);
      }

      const techStacksValidated = techStacksValidation.value;
      if (techStacksValidated.length !== allTechStackIds.length) {
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
    // Ajouter les nouvelles keyFeatures si fournies
    if (props.keyFeatures) {
      const updateProjectKeyFeaturesResult = existingProject.updateKeyFeatures(
        props.keyFeatures,
      );
      if (!updateProjectKeyFeaturesResult.success) {
        return Result.fail(updateProjectKeyFeaturesResult.error);
      }
      const updateKeyFeatures = await this.keyFeatureRepo.updateMany(
        updateProjectKeyFeaturesResult.value,
      );
      if (!updateKeyFeatures.success)
        return Result.fail(updateKeyFeatures.error);
    }

    // Préparer les données pour la mise à jour
    const existingData = existingProject.toPrimitive();
    const updatedData = {
      ...existingData,
      title: props.title ?? existingData.title,
      description: props.description ?? existingData.description,
      shortDescription: props.shortDescription ?? existingData.shortDescription,
      externalLinks: props.externalLinks ?? existingData.externalLinks,
      techStacks: allTechStacksValidated,
      categories: allCategoriesValidated,
      // keyFeatures: existingData.keyFeatures,
      projectGoals: props.projectGoals
        ? props.projectGoals.map((goal) => ({ goal }))
        : existingData.projectGoals,
      // projectRoles: props.projectRoles
      //   ? props.projectRoles.map((role) => ({
      //       title: role.title,
      //       description: role.description,
      //       isFilled: false,
      //       techStacks: role.techStacks.map((ts) => ({
      //         id: ts,
      //         name: allTechStacksValidated.find((t) => t.id === ts)
      //           ?.name as string,
      //         iconUrl: allTechStacksValidated.find((t) => t.id === ts)
      //           ?.iconUrl as string,
      //       })),
      //     }))
      //   : existingData.projectRoles,
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
