import { Result } from '@/shared/result';
import {
  TechStack,
  TechStackValidationErrors,
} from '@/domain/techStack/techstack.entity';

export type ProjectCreateProps = {
  ownerId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  socialLinks?: string[] | undefined;
  githubLink: string | null;
  techStacks: { id: string; name: string; iconUrl: string }[];
  projectRoles?: { name: string; description: string }[];
  projectMembers?: { userId: string; role: string }[];
};

export type ProjectValidationErrors = {
  title?: string;
  description?: string;
  difficulty?: string;
  techStacks?: string;
  socialLinks?: string;
  projectRoles?: string;
  projectMembers?: string;
};
export type ProjectProps = {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  socialLinks?: string[] | undefined;
  githubLink: string | null;
  techStacks: TechStack[];
  projectRoles?: { name: string; description: string }[];
  projectMembers?: { userId: string; role: string }[];
  createdAt?: Date;
  updatedAt?: Date;
};
export class Project {
  private readonly id?: string;
  private ownerId: string;
  private title: string;
  private description: string;
  private difficulty: 'easy' | 'medium' | 'hard';
  private socialLinks?: string[] | undefined;
  private githubLink: string | null;
  private createdAt?: Date;
  private updatedAt?: Date;
  private techStacks: TechStack[];
  private projectRoles: { name: string; description: string }[];
  private projectMembers?: { userId: string; role: string }[];

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.title = props.title;
    this.description = props.description;
    this.difficulty = props.difficulty;
    this.socialLinks = props.socialLinks;
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
    props: ({ projectId?: string } & ProjectCreateProps) | ProjectProps,
  ): Result<Project, ProjectValidationErrors | string> {
    const error: ProjectValidationErrors = {};
    //title
    if (!props.title || props.title.trim() === '') {
      error.title = 'Title is required';
    }
    if (props.title.length > 100) {
      error.title = 'Title must be less than 100 characters';
    }
    //description
    if (!props.description || props.description.trim() === '') {
      error.description = 'Description is required';
    }
    if (props.description.length > 1000) {
      error.description = 'Description must be less than 1000 characters';
    }
    //difficulty
    if (!props.difficulty) {
      error.difficulty = 'Difficulty is required';
    }
    //projectRoles
    if (!props.projectRoles || props.projectRoles.length === 0) {
      error.projectRoles = 'Project roles are required';
    } else {
      for (const role of props.projectRoles) {
        if (!role.name || role.name.trim() === '') {
          error.projectRoles = 'Name for project roles is required';
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
    //projectMembers
    if (props.projectMembers && props.projectMembers.length > 0) {
      for (const member of props.projectMembers) {
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
    //techStacks
    if (props.techStacks.length === 0) {
      error.techStacks = 'Tech stacks are required';
    }
    const techStacks: Result<TechStack, TechStackValidationErrors | string>[] =
      props.techStacks.map((techStack) => TechStack.reconstitute(techStack));

    const validTechStacks = techStacks
      .filter((res) => res.success)
      .map((res) => res.value);

    if (validTechStacks.length !== props.techStacks.length) {
      error.techStacks = 'Tech stacks are not valid';
    }

    if (Object.keys(error).length > 0) {
      return Result.fail(error);
    }
    return Result.ok(
      new Project({
        id: 'projectId' in props ? props.projectId : undefined,
        ...props,
        techStacks: validTechStacks,
      }),
    );
  }

  public static reconstitute(
    props: ProjectProps,
  ): Result<Project, ProjectValidationErrors | string> {
    if (!props.id) {
      return Result.fail('Id is required');
    }
    return Project.validate(props);
  }
}
