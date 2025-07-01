import { Result } from '@/shared/result';
import {
  TechStack,
  TechStackValidationErrors,
  TechStackPrimitive,
} from '@/domain/techStack/techstack.entity';

export type ProjectValidationErrors = {
  title?: string;
  description?: string;
  difficulty?: string;
  techStacks?: string;
  socialLinks?: string;
  projectRoles?: string;
  projectMembers?: string;
};

export type ProjectCreateProps = {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  externalLinks?: { type: string; url: string }[] | undefined;
  projectImages?: string[];
  githubLink: string | null;
  techStacks: TechStackPrimitive[];
  projectRoles?: { id?: string; title: string; description: string }[];
  projectMembers?: { userId: string; name: string; role: string }[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type ProjectPrimitive = {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  externalLinks?: { type: string; url: string }[] | undefined;
  projectImages?: string[];
  githubLink: string | null;
  techStacks: TechStack[];
  projectRoles?: { id?: string; title: string; description: string }[];
  projectMembers?: { userId: string; name: string; role: string }[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type ProjectProps = {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  externalLinks?: { type: string; url: string }[] | undefined;
  projectImages?: string[];
  githubLink: string | null;
  techStacks: TechStack[];
  projectRoles?: { id?: string; title: string; description: string }[];
  projectMembers?: { userId: string; name: string; role: string }[];
  createdAt?: Date;
  updatedAt?: Date;
};
export class Project {
  private readonly id?: string;
  private ownerId: string;
  private title: string;
  private description: string;
  private difficulty: 'easy' | 'medium' | 'hard';
  private externalLinks?: { type: string; url: string }[] | undefined;
  private projectImages?: string[];
  private githubLink: string | null;
  private techStacks: TechStack[];
  private projectRoles?: { title: string; description: string }[];
  private projectMembers?: { userId: string; name: string; role: string }[];
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.title = props.title;
    this.description = props.description;
    this.difficulty = props.difficulty;
    this.externalLinks = props.externalLinks;
    this.projectImages = props.projectImages;
    this.githubLink = props.githubLink;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.techStacks = props.techStacks;
    this.projectRoles = props.projectRoles ?? [];
    this.projectMembers = props.projectMembers ?? [];
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
    //title, TODO: make a VO
    if (!rest.title || rest.title.trim() === '') {
      error.title = 'Title is required';
    }
    if (rest.title.length > 100) {
      error.title = 'Title must be less than 100 characters';
    }
    //description, TODO: make a VO
    if (!rest.description || rest.description.trim() === '') {
      error.description = 'Description is required';
    }
    if (rest.description.length > 1000) {
      error.description = 'Description must be less than 1000 characters';
    }
    //difficulty, TODO: make a VO
    if (!rest.difficulty) {
      error.difficulty = 'Difficulty is required';
    }
    //projectRoles TODO: verifiy if is not need to be moved to another entity dedicated
    if (!rest.projectRoles || rest.projectRoles.length === 0) {
      error.projectRoles = 'Project roles are required';
    } else {
      for (const role of rest.projectRoles) {
        if (!role.title || role.title.trim() === '') {
          error.projectRoles = 'Title for project roles is required';
          break;
        }
        if (!role.description || role.description.trim() === '') {
          error.projectRoles = 'Description for project roles is required';
          break;
        }
        if (role.description.length > 1000) {
          error.projectRoles =
            'Description for project roles must be less than 1000 characters';
          break;
        }
      }
    }
    //projectMembers TODO: verifiy if is not need to be moved to another entity dedicated
    if (rest.projectMembers && rest.projectMembers.length > 0) {
      for (const member of rest.projectMembers) {
        if (!member.userId || member.userId.trim() === '') {
          error.projectMembers = 'User id for project members is required';
          break;
        }
        if (!member.role || member.role.trim() === '') {
          error.projectMembers = 'Role for project members is required';
          break;
        }
      }
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
      techStacks: validTechStacks,
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
  private getProjectRoles(): { title: string; description: string }[] {
    return [...(this.projectRoles ?? [])];
  }

  public toPrimitive(): ProjectPrimitive {
    return {
      id: this.id,
      ownerId: this.ownerId,
      title: this.title,
      description: this.description,
      difficulty: this.difficulty,
      externalLinks: this.externalLinks,
      projectImages: this.projectImages,
      githubLink: this.githubLink,
      techStacks: this.getTechStacks(),
      projectRoles: this.getProjectRoles(),
      projectMembers: this.projectMembers,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public hasRoleWithTitle(title: string): boolean {
    if (!this.projectRoles) {
      return false;
    }
    const normalizedTitle = title.toLowerCase();
    return this.projectRoles.some(
      (role) => role.title.toLowerCase() === normalizedTitle,
    );
  }

  public hasOwnerId(userId: string): boolean {
    return this.ownerId === userId;
  }
}
