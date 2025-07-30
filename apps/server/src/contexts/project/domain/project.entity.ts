import { Category } from '@/contexts/category/domain/category.entity';
import { ProjectGoals } from '@/contexts/project/bounded-contexts/project-goals/domain/project-goals.entity';
import {
  ProjectRole,
  ProjectRoleValidationErrors,
} from '@/contexts/project/bounded-contexts/project-role/domain/project-role.entity';
import {
  TechStack,
  TechStackValidationErrors,
} from '@/contexts/techstack/domain/techstack.entity';
import { Result } from '@/libs/result';
import { KeyFeature } from '../bounded-contexts/project-key-feature/domain/key-feature.entity';
import { Description, ShortDescription, Title } from './vo';

export type ProjectValidationErrors = {
  ownerId?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  techStacks?: TechStackValidationErrors | string;
  projectRoles?: ProjectRoleValidationErrors | string;
  categories?: string;
  keyFeatures?: string;
  projectGoals?: string;
  // collaborators?: string;
};

// Type unifié pour création et reconstitution
export type ProjectData = {
  id?: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  description: string;
  categories: { id: string; name: string }[];
  externalLinks?: { type: string; url: string }[];
  techStacks: {
    id: string;
    name: string;
    iconUrl: string;
    type: 'LANGUAGE' | 'TECH';
  }[];
  projectRoles: {
    projectId?: string;
    id?: string;
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: {
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }[];
    createdAt?: Date;
    updatedAt?: Date;
  }[];
  keyFeatures: { id?: string; feature: string }[];
  projectGoals: { id?: string; goal: string }[];
  image?: string;
  coverImages?: string[]; // Array of cover image URLs (1 to 4)
  readme?: string; // Ajout du champ README
  createdAt?: Date;
  updatedAt?: Date;
};

// Alias pour compatibilité avec le code existant
export type ProjectCreateProps = ProjectData;
export type ProjectPrimitive = ProjectData;

export type ProjectProps = {
  id?: string;
  ownerId: string;
  title: Title;
  shortDescription: ShortDescription;
  description: Description;
  externalLinks?: { type: string; url: string }[];
  techStacks: TechStack[];
  projectRoles?: ProjectRole[];
  categories: Category[];
  keyFeatures: KeyFeature[];
  projectGoals: ProjectGoals[];
  image?: string;
  coverImages?: string[];
<<<<<<< HEAD
  readme?: string;
=======
>>>>>>> origin/main
  createdAt?: Date;
  updatedAt?: Date;
};

export class Project {
  private readonly id?: string;
  private ownerId: string;
  private title: Title;
  private shortDescription: ShortDescription;
  private description: Description;
  private externalLinks?: { type: string; url: string }[] | undefined;
  private techStacks: TechStack[];
  private projectRoles?: ProjectRole[];
  private categories: Category[];
  private keyFeatures: KeyFeature[];
  private projectGoals: ProjectGoals[];
  private image?: string;
  private coverImages?: string[];
  private readme?: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.title = props.title;
    this.shortDescription = props.shortDescription;
    this.description = props.description;
    this.externalLinks = props.externalLinks;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.techStacks = props.techStacks;
    this.projectRoles = props.projectRoles;
    this.categories = props.categories;
    this.keyFeatures = props.keyFeatures;
    this.projectGoals = props.projectGoals;
    this.image = props.image;
    this.coverImages = props.coverImages;
    this.readme = props.readme;
  }

  //utiliser uniquement pour créer un nouveau projet
  public static create(
    props: ProjectData,
  ): Result<Project, ProjectValidationErrors | string> {
    return Project.validate(props);
  }
  //quand un projet existe et est récupérer de la persistance
  public static reconstitute(
    props: ProjectData,
  ): Result<Project, ProjectValidationErrors | string> {
    if (!props.id) {
      return Result.fail('id is required');
    }
    if (!props.createdAt || !props.updatedAt) {
      return Result.fail(
        'createdAt and updatedAt are required for the project reconstitution',
      );
    }
    if (props.createdAt > props.updatedAt) {
      return Result.fail('createdAt must be before updatedAt');
    }

    return Project.validate(props);
  }

  public static validate(
    props: ProjectData,
  ): Result<Project, ProjectValidationErrors | string> {
    const validationErrors: ProjectValidationErrors = {};
    if (!props.ownerId) validationErrors.ownerId = 'ownerId is required';
    if (!props.techStacks || props.techStacks.length === 0)
      validationErrors.techStacks = 'At least one tech stack is required';
    if (!props.categories || props.categories.length === 0)
      validationErrors.categories = 'At least one category is required';
    if (!props.keyFeatures || props.keyFeatures.length === 0)
      validationErrors.keyFeatures = 'At least one key feature is required';
    if (!props.projectGoals || props.projectGoals.length === 0)
      validationErrors.projectGoals = 'At least one project goal is required';

    const voValidationResults = {
      title: Title.create(props.title),
      description: Description.create(props.description),
      shortDescription: ShortDescription.create(props.shortDescription),
      techStacks: TechStack.reconstituteMany(props.techStacks),
      categories: Category.reconstituteMany(props.categories),
      projectRoles: props.projectRoles.some((pr) => !pr.id)
        ? ProjectRole.createMany(props.projectRoles)
        : ProjectRole.reconstituteMany(props.projectRoles),
      keyFeatures: KeyFeature.createMany(props.keyFeatures),
      projectGoals: ProjectGoals.createMany(props.projectGoals),
    };
    //extract the error from the validation results
    Object.entries(voValidationResults).forEach(([key, result]) => {
      if (!result.success)
        validationErrors[key as keyof ProjectValidationErrors] =
          result.error as string;
    });
    //reconstitute the object with the value of the validation results
    const {
      title,
      description,
      shortDescription,
      techStacks,
      projectRoles,
      categories,
      keyFeatures,
      projectGoals,
    } = Object.fromEntries(
      Object.entries(voValidationResults).map(([key, result]) => [
        key,
        result.success ? result.value : result.error,
      ]),
    ) as {
      title: Title;
      description: Description;
      shortDescription: ShortDescription;
      techStacks: TechStack[];
      projectRoles: ProjectRole[];
      categories: Category[];
      keyFeatures: KeyFeature[];
      projectGoals: ProjectGoals[];
    };

    if (Object.keys(validationErrors).length > 0)
      return Result.fail(validationErrors);

    return Result.ok(
      new Project({
        ...props,
        title,
        shortDescription,
        description,
        techStacks,
        projectRoles,
        categories,
        keyFeatures,
        projectGoals,
      }),
    );
  }

  private getTechStacks(): ReadonlyArray<TechStack> {
    return Object.freeze([...this.techStacks]);
  }
  // private getProjectRoles(): ReadonlyArray<ProjectRole> {
  //   return Object.freeze([...(this.projectRoles || [])]);
  // }

  public toPrimitive(): ProjectData {
    return {
      id: this.id,
      ownerId: this.ownerId,
      title: this.title.getTitle(),
      shortDescription: this.shortDescription.getShortDescription(),
      description: this.description.getDescription(),
      externalLinks: this.externalLinks,
      techStacks: this.techStacks.map((ts) => {
        const { id, name, iconUrl, type } = ts.toPrimitive();
        return { id, name, iconUrl, type };
      }),
      projectRoles: this.projectRoles?.map((pr) => pr.toPrimitive()) || [],
      categories: this.categories.map((c) => c.toPrimitive()),
      keyFeatures: this.keyFeatures.map((kf) => kf.toPrimitive()),
      projectGoals: this.projectGoals.map((pg) => pg.toPrimitive()),
      image: this.image,
      coverImages: this.coverImages,
      readme: this.readme,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public addExternalLink(externalLink: {
    type: string;
    url: string;
  }): Result<void, string> {
    if (!this.externalLinks) {
      this.externalLinks = [];
    }
    this.externalLinks.push(externalLink);
    return Result.ok(undefined);
  }

  public createRole(projectRoles: {
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: {
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }[];
  }): Result<ProjectRole, ProjectRoleValidationErrors | string> {
    const projectId = this.id;
    const projectRoleResult = ProjectRole.create({
      ...projectRoles,
      projectId,
    });
    if (!projectRoleResult.success) {
      return Result.fail(projectRoleResult.error as string);
    }
    return Result.ok(projectRoleResult.value);
  }
  //pour créer un role qui respecte nos regles métier, utiliser uniquement quand un projet existe et est récupérer de la persistance
  public createRoles(
    projectRoles: {
      title: string;
      description: string;
      isFilled: boolean;
      techStacks: {
        id: string;
        name: string;
        iconUrl: string;
        type: 'LANGUAGE' | 'TECH';
      }[];
    }[],
  ): Result<ProjectRole[], ProjectRoleValidationErrors | string> {
    const projectRolesResults = ProjectRole.createMany(projectRoles);
    if (!projectRolesResults.success) {
      return Result.fail(projectRolesResults.error as string);
    }
    return Result.ok(projectRolesResults.value);
  }

  //pour ajouter un role à un projet existant,
  //utiliser une fois que le project role est créer dans la persistance
  public addRole(projectRole: ProjectRole): Result<void, string> {
    if (projectRole.toPrimitive().projectId !== this.id) {
      return Result.fail('Project role does not belong to this project');
    }
    if (!projectRole.toPrimitive().id) {
      return Result.fail('Project role id is required');
    }
    if (!this.projectRoles) {
      this.projectRoles = [];
    }
    this.projectRoles.push(projectRole);
    return Result.ok(undefined);
  }

  //même chose que addRole mais pour en ajouter plusieurs en une fois
  public addRoles(projectRoles: ProjectRole[]): Result<void, string> {
    const projectRolesResults = projectRoles.map((pr) => this.addRole(pr));
    if (projectRolesResults.some((r) => !r.success)) {
      return Result.fail(
        projectRolesResults.find((r) => !r.success)?.error as string,
      );
    }
    return Result.ok(undefined);
  }

  // public hasRoleWithTitle(title: string): boolean {
  // if (!this.projectRoles) {
  //   return false;
  // }
  // const normalizedTitle = title.toLowerCase();
  // return this.projectRoles.some(
  //   (role) => role.toPrimitive().title.toLowerCase() === normalizedTitle,
  // );
  //   return false;
  // }

  public hasOwnerId(userId: string): boolean {
    return this.ownerId === userId;
  }

  // Authorization and validation methods only
  public canUserModifyRoles(userId: string): boolean {
    return this.hasOwnerId(userId);
  }

  public updateKeyFeatures(
    keyFeatures: {
      id?: string;
      projectId?: string;
      feature: string;
    }[],
  ): Result<KeyFeature[], string> {
    const keyFeatureResults = keyFeatures.map((kf) =>
      KeyFeature.create({
        ...kf,
      }),
    );
    if (!keyFeatureResults.every((kf) => kf.success)) {
      return Result.fail(
        keyFeatureResults.find((kf) => !kf.success)?.error as string,
      );
    }

    const validatedKeyFeatures = keyFeatureResults.map((kf) => kf.value);
    const currentKeyFeatures = this.keyFeatures || [];

    // Identifier les keyFeatures à conserver/modifier et les nouvelles
    const incomingIds = validatedKeyFeatures
      .map((kf) => kf.toPrimitive().id)
      .filter(Boolean);

    // Supprimer les keyFeatures qui ne sont plus dans la liste entrante
    const remainingKeyFeatures = currentKeyFeatures.filter((kf) => {
      const id = kf.toPrimitive().id;
      return id && incomingIds.includes(id);
    });

    // Mettre à jour les keyFeatures existantes et ajouter les nouvelles
    const updatedKeyFeatures = validatedKeyFeatures.map((newKf) => {
      const newKfData = newKf.toPrimitive();
      if (newKfData.id) {
        // Keyfeature existante - la remplacer
        return newKf;
      } else {
        // Nouvelle keyfeature
        return newKf;
      }
    });

    this.keyFeatures = [...remainingKeyFeatures, ...updatedKeyFeatures];
    return Result.ok(this.keyFeatures);
  }

  public hasKeyFeature(keyFeatureId: string): boolean {
    return this.keyFeatures.some((kf) => kf.toPrimitive().id === keyFeatureId);
  }

  public hasProjectGoal(projectGoalId: string): boolean {
    return this.projectGoals.some(
      (pg) => pg.toPrimitive().id === projectGoalId,
    );
  }

  public getKeyFeature(keyFeatureId: string): Result<KeyFeature, string> {
    const keyFeature = this.keyFeatures.find(
      (kf) => kf.toPrimitive().id === keyFeatureId,
    );
    if (!keyFeature) {
      return Result.fail('Key feature not found');
    }
    return Result.ok(keyFeature);
  }

  public getProjectGoal(projectGoalId: string): Result<ProjectGoals, string> {
    const projectGoal = this.projectGoals.find(
      (pg) => pg.toPrimitive().id === projectGoalId,
    );
    if (!projectGoal) {
      return Result.fail('Project goal not found');
    }
    return Result.ok(projectGoal);
  }
}
