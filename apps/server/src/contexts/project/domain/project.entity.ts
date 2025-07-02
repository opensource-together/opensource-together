import { Result } from '@/shared/result';
import {
  TechStack,
  TechStackValidationErrors,
  TechStackPrimitive,
} from '@/domain/techStack/techstack.entity';
// import { ProjectRole } from '@/contexts/project-role/domain/project-role.entity';
import { Description, ShortDescription, Title } from './vo';

export type ProjectValidationErrors = {
  title?: string;
  description?: string;
  shortDescription?: string;
  projectImage?: string;
  difficulty?: string;
  techStacks?: string;
  socialLinks?: string;
  projectRoles?: string;
  collaborators?: string;
};

export type ProjectCreateProps = {
  id?: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  description: string;
  externalLinks?: { type: string; url: string }[] | undefined;
  // projectImage: string;
  techStacks: TechStackPrimitive[];
  // projectRoles: ProjectRole[];
  // projectMembers?: { userId: string; name: string; role: string }[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type ProjectPrimitive = {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  shortDescription: string;
  // projectImage: string;
  externalLinks?: { type: string; url: string }[] | undefined;
  techStacks: TechStack[];
  // projectRoles: ProjectRole[];
  // collaborators: { userId: string; name: string; role: string }[];
  // keyFeatures: string[];
  // projectGoals: string[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type ProjectProps = {
  id?: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  description: string;
  externalLinks?: { type: string; url: string }[]; //au moins un qui est le repo github, apres la creation de projet
  // projectImage: string;
  techStacks: TechStack[];
  // projectRoles: ProjectRole[];
  // collaborators: { userId: string; name: string; role: string }[];
  // keyFeatures: string[];
  // projectGoals: string[];
  createdAt?: Date;
  updatedAt?: Date;
};
export class Project {
  private readonly id?: string;
  private ownerId: string;
  private title: string;
  private shortDescription: string;
  private description: string;
  private externalLinks?: { type: string; url: string }[] | undefined;
  // private projectImage: string;
  private techStacks: TechStack[];
  // private projectRoles: ProjectRole[];
  // private collaborators: { userId: string; name: string; role: string }[];
  // private keyFeatures: string[];
  // private projectGoals: string[];
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.title = props.title;
    this.shortDescription = props.shortDescription;
    this.description = props.description;
    this.externalLinks = props.externalLinks;
    // this.projectImage = props.projectImage;
    // this.keyFeatures = props.keyFeatures;
    // this.projectGoals = props.projectGoals;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.techStacks = props.techStacks;
    // this.projectRoles = props.projectRoles;
    // this.collaborators = props.collaborators ?? [];
  }

  public static create(
    props: ProjectCreateProps,
  ): Result<Project, ProjectValidationErrors | string> {
    return Project.validate(props);
  }

  public static validate(
    props: ProjectCreateProps,
  ): Result<Project, ProjectValidationErrors | string> {
    const { id, createdAt, updatedAt, ...rest } = props;
    const error: ProjectValidationErrors = {};
    const title = Title.create(rest.title);
    if (!title.success) {
      error.title = title.error;
    }

    const description = Description.create(rest.description);
    if (!description.success) {
      error.description = description.error;
    }

    const shortDescription = ShortDescription.create(rest.shortDescription);
    if (!shortDescription.success) {
      error.shortDescription = shortDescription.error;
    }

    //techStacks, TODO: verify if is not need to be moved to another part dedicated
    if (rest.techStacks.length === 0) {
      error.techStacks = 'Tech stacks are required';
    }
    if (rest.techStacks.some((techStack) => !techStack.id)) {
      error.techStacks = 'Tech stack id is required';
    }
    const techStacks: Result<TechStack, TechStackValidationErrors | string>[] =
      rest.techStacks.map((techStack) =>
        TechStack.reconstitute({
          id: techStack.id ?? '',
          name: techStack.name,
          iconUrl: techStack.iconUrl,
        }),
      );

    const validTechStacks = techStacks
      .filter((res) => res.success)
      .map((res) => res.value);

    if (validTechStacks.length !== rest.techStacks.length) {
      error.techStacks = 'Tech stacks are not valid';
    }

    if (Object.keys(error).length > 0) {
      return Result.fail(error);
    }
    const project: Project = new Project({
      id,
      ...rest,
      shortDescription: rest.shortDescription,
      // projectImage: rest.projectImage,
      techStacks: validTechStacks,
      // projectRoles: [],
      // collaborators: [],
      // keyFeatures: [],
      // projectGoals: [],
      createdAt,
      updatedAt,
    });
    return Result.ok(project);
  }

  public static reconstitute(
    props: ProjectCreateProps,
  ): Result<Project, ProjectValidationErrors | string> {
    if (!props.id) {
      return Result.fail('id is required');
    }
    if (!props.createdAt || !props.updatedAt) {
      return Result.fail('createdAt and updatedAt are required');
    }
    if (props.createdAt > props.updatedAt) {
      return Result.fail('createdAt must be before updatedAt');
    }
    return Project.validate(props);
  }

  private getTechStacks(): TechStack[] {
    return [...this.techStacks];
  }
  // private getProjectRoles(): ProjectRole[] {
  //   return [...this.projectRoles];
  // }

  public toPrimitive(): ProjectPrimitive {
    return {
      id: this.id,
      ownerId: this.ownerId,
      title: this.title,
      shortDescription: this.shortDescription,
      description: this.description,
      externalLinks: this.externalLinks,
      // projectImage: this.projectImage,
      techStacks: this.getTechStacks(),
      // projectRoles: this.getProjectRoles(),
      // collaborators: this.collaborators,
      // keyFeatures: this.keyFeatures,
      // projectGoals: this.projectGoals,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // public addProjectRole(projectRole: ProjectRole): Result<ProjectRole, string> {
  //   if (!this.id) {
  //     return Result.fail('Project id is required');
  //   }
  //   const projectRoleResult = ProjectRole.create({
  //     projectId: this.id,
  //     roleTitle: projectRole.toPrimitive().roleTitle,
  //     description: projectRole.toPrimitive().description,
  //     isFilled: projectRole.toPrimitive().isFilled,
  //     skillSet: projectRole.toPrimitive().skillSet,
  //   });
  //   if (!projectRoleResult.success) {
  //     return Result.fail(projectRoleResult.error as string);
  //   }

  //   if (
  //     this.hasRoleWithTitle(projectRoleResult.value.toPrimitive().roleTitle)
  //   ) {
  //     return Result.fail(
  //       'A role with this title already exists in this project',
  //     );
  //   }

  //   this.projectRoles.push(projectRoleResult.value);
  //   return Result.ok(projectRoleResult.value);
  // }

  // public hasRoleWithTitle(title: string): boolean {
  //   if (!this.projectRoles) {
  //     return false;
  //   }
  //   const normalizedTitle = title.toLowerCase();
  //   return this.projectRoles.some(
  //     (role) => role.toPrimitive().roleTitle.toLowerCase() === normalizedTitle,
  //   );
  // }

  // public hasRoleId(roleId: string): boolean {
  //   if (!this.projectRoles) {
  //     return false;
  //   }
  //   return this.projectRoles.some((role) => role.toPrimitive().id === roleId);
  // }

  public hasOwnerId(userId: string): boolean {
    return this.ownerId === userId;
  }

  // Authorization and validation methods only
  public canUserModifyRoles(userId: string): boolean {
    return this.hasOwnerId(userId);
  }
}
