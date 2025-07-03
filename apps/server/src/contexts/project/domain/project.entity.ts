import { Result } from '@/shared/result';
import {
  TechStack,
  TechStackValidationErrors,
} from '@/contexts/techstack/domain/techstack.entity';
import {
  ProjectRole,
  ProjectRoleValidationErrors,
} from '@/contexts/project-role/domain/project-role.entity';
import { Description, ShortDescription, Title } from './vo';

export type ProjectValidationErrors = {
  ownerId?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  techStacks?: TechStackValidationErrors | string;
  projectRoles?: ProjectRoleValidationErrors | string;
  // collaborators?: string;
};

// Type unifié pour création et reconstitution
export type ProjectData = {
  id?: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  description: string;
  externalLinks?: { type: string; url: string }[];
  techStacks: { id: string; name: string; iconUrl: string }[];
  projectRoles: {
    id?: string;
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: { id: string; name: string; iconUrl: string }[];
    createdAt?: Date;
    updatedAt?: Date;
  }[];
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
  }

  public static create(
    props: ProjectData,
  ): Result<Project, ProjectValidationErrors | string> {
    return Project.validate(props);
  }

  public static validate(
    props: ProjectData,
  ): Result<Project, ProjectValidationErrors | string> {
    const validationErrors: ProjectValidationErrors = {};
    if (!props.ownerId) validationErrors.ownerId = 'ownerId is required';
    if (!props.techStacks || props.techStacks.length === 0)
      validationErrors.techStacks = 'At least one tech stack is required';

    const voValidationResults = {
      title: Title.create(props.title),
      description: Description.create(props.description),
      shortDescription: ShortDescription.create(props.shortDescription),
      techStacks: TechStack.reconstituteMany(props.techStacks),
    };
    //extract the error from the validation results
    Object.entries(voValidationResults).forEach(([key, result]) => {
      if (!result.success)
        validationErrors[key as keyof ProjectValidationErrors] =
          result.error as string;
    });
    //reconstitute the object with the value of the validation results
    const { title, description, shortDescription, techStacks } =
      Object.fromEntries(
        Object.entries(voValidationResults).map(([key, result]) => [
          key,
          result.success ? result.value : result.error,
        ]),
      ) as {
        title: Title;
        description: Description;
        shortDescription: ShortDescription;
        techStacks: TechStack[];
      };

    let projectRoles: ProjectRole[] = [];
    if (props.projectRoles.length > 0) {
      let validationResults: Result<
        ProjectRole[],
        ProjectRoleValidationErrors | string
      >;
      if (props.projectRoles.every((pr) => pr.id)) {
        validationResults = ProjectRole.reconstituteMany(
          props.projectRoles.map((pr) => ({
            ...pr,
            projectId: props.id as string,
          })),
        );
        if (!validationResults.success) {
          validationErrors.projectRoles =
            validationResults.error as ProjectRoleValidationErrors;
        }
        projectRoles = validationResults.success ? validationResults.value : [];
      }
    } else {
      projectRoles = [];
    }
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
      }),
    );
  }

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
      techStacks: this.techStacks.map((ts) => ts.toPrimitive()),
      projectRoles: this.projectRoles?.map((pr) => pr.toPrimitive()) || [],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public createProjectRole(projectRole: {
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: { id: string; name: string; iconUrl: string }[];
  }): Result<ProjectRole, string> {
    const techStacks = TechStack.reconstituteMany(projectRole.techStacks);
    if (!techStacks.success) {
      return Result.fail(techStacks.error as string);
    }
    console.log('projectId', this.id);
    const projectRoleResult = ProjectRole.create({
      projectId: this.id as string,
      title: projectRole.title,
      description: projectRole.description,
      isFilled: projectRole.isFilled,
      techStacks: techStacks.value.map((ts) => ts.toPrimitive()),
    });
    console.log('projectRoleResult', projectRoleResult);
    if (!projectRoleResult.success) {
      return Result.fail(projectRoleResult.error as string);
    }

    // this.projectRoles?.push(projectRoleResult.value);
    return Result.ok(projectRoleResult.value);
  }

  public addProjectRole(projectRole: ProjectRole): Result<void, string> {
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

  public addProjectRoles(projectRoles: ProjectRole[]): Result<void, string> {
    const projectRolesResults = projectRoles.map((pr) =>
      this.addProjectRole(pr),
    );
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
}
