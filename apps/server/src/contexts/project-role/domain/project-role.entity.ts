import { Result } from '@/libs/result';
import {
  TechStack,
  TechStackValidationErrors,
} from '@/contexts/techstack/domain/techstack.entity';

// Type unifié pour la création et la reconstitution
export type ProjectRoleData = {
  id?: string;
  projectId?: string;
  title: string;
  description: string;
  isFilled: boolean;
  techStacks: { id: string; name: string; iconUrl: string }[];
  createdAt?: Date;
  updatedAt?: Date;
};

// Alias pour la consistance du code
export type ProjectRoleCreateProps = Omit<
  ProjectRoleData,
  'id' | 'createdAt' | 'updatedAt'
>;
export type ProjectRolePrimitive = ProjectRoleData;

export type ProjectRoleValidationErrors = {
  id?: string;
  projectId?: string;
  title?: string;
  description?: string;
  isFilled?: string;
  techStacks?: TechStackValidationErrors | string;
};

export class ProjectRole {
  private readonly id?: string;
  private readonly projectId?: string;
  private title: string;
  private description: string;
  private isFilled: boolean;
  private techStacks: TechStack[];
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  private constructor(props: {
    id?: string;
    projectId?: string;
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: TechStack[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.title = props.title;
    this.description = props.description;
    this.isFilled = props.isFilled;
    this.techStacks = props.techStacks;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  private static validate(
    props: ProjectRoleData,
  ): Result<ProjectRole, ProjectRoleValidationErrors | string> {
    const errors: ProjectRoleValidationErrors = {};

    if (!props.title || props.title.trim() === '') {
      errors.title = 'Role title is required';
    } else if (props.title.length > 100) {
      errors.title = 'Role title must be less than 100 characters';
    }

    if (!props.description || props.description.trim() === '') {
      errors.description = 'Description is required';
    } else if (props.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (typeof props.isFilled !== 'boolean') {
      errors.isFilled = 'isFilled must be a boolean';
    }

    if (!props.techStacks || props.techStacks.length === 0) {
      errors.techStacks = 'At least one tech stack is required';
    }

    const techStacksResult = TechStack.reconstituteMany(props.techStacks);
    if (!techStacksResult.success) {
      errors.techStacks = techStacksResult.error as string;
    }

    if (Object.keys(errors).length > 0) {
      return Result.fail(errors);
    }

    return Result.ok(
      new ProjectRole({
        ...props,
        techStacks: techStacksResult.success ? techStacksResult.value : [],
      }),
    );
  }

  public static create(
    props: ProjectRoleCreateProps,
  ): Result<ProjectRole, ProjectRoleValidationErrors | string> {
    if (props.isFilled) {
      return Result.fail({ isFilled: 'isFilled must be false on creation' });
    }
    const dataToValidate: ProjectRoleData = { ...props, isFilled: false };
    return this.validate(dataToValidate);
  }

  public static createMany(
    props: ProjectRoleCreateProps[],
  ): Result<ProjectRole[], ProjectRoleValidationErrors | string> {
    const results = props.map((p) => this.create(p));
    if (!results.every((r) => r.success))
      return Result.fail(results.find((r) => !r.success)?.error as string);
    return Result.ok(results.map((r) => r.value));
  }

  public static reconstitute(
    props: ProjectRolePrimitive,
  ): Result<ProjectRole, ProjectRoleValidationErrors | string> {
    if (!props.id) {
      return Result.fail({ id: 'id is required' });
    }
    if (!props.projectId) {
      return Result.fail({ projectId: 'projectId is required' });
    }

    if (!props.createdAt || !props.updatedAt) {
      return Result.fail(
        'createdAt and updatedAt are required for the project role reconstitution',
      );
    }
    if (props.createdAt > props.updatedAt) {
      return Result.fail('createdAt must be before updatedAt');
    }
    return this.validate(props);
  }

  public static reconstituteMany(
    props: ProjectRolePrimitive[],
  ): Result<ProjectRole[], ProjectRoleValidationErrors | string> {
    const results = props.map((p) => this.reconstitute(p));

    if (!results.every((r) => r.success))
      return Result.fail(results.find((r) => !r.success)?.error as string);
    return Result.ok(results.map((r) => r.value));
  }

  public updateRole(props: {
    title?: string;
    description?: string;
    isFilled?: boolean;
    techStacks?: TechStack[];
  }): Result<void, ProjectRoleValidationErrors | string> {
    const techStackPrimitives = (props.techStacks || this.techStacks).map(
      (ts) => ts.toPrimitive(),
    );

    const updatedProps: ProjectRoleData = {
      id: this.id,
      projectId: this.projectId,
      title: props.title ?? this.title,
      description: props.description ?? this.description,
      isFilled: props.isFilled ?? this.isFilled,
      techStacks: techStackPrimitives,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    const validationResult = ProjectRole.validate(updatedProps);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    const validatedRole = validationResult.value;
    this.title = validatedRole.title;
    this.description = validatedRole.description;
    this.isFilled = validatedRole.isFilled;
    this.techStacks = validatedRole.techStacks;

    return Result.ok(undefined);
  }

  public markAsFilled(): void {
    this.isFilled = true;
  }

  public markAsUnfilled(): void {
    this.isFilled = false;
  }

  public addSkill(techStack: TechStack): Result<void, string> {
    const skillExists = this.techStacks.some(
      (ts) => ts.toPrimitive().id === techStack.toPrimitive().id,
    );

    if (skillExists) {
      return Result.fail('Skill already exists in this role');
    }

    this.techStacks.push(techStack);
    return Result.ok(undefined);
  }

  public removeSkill(techStackId: string): Result<void, string> {
    const initialLength = this.techStacks.length;
    this.techStacks = this.techStacks.filter(
      (skill) => skill.toPrimitive().id !== techStackId,
    );

    if (this.techStacks.length === initialLength) {
      return Result.fail('Skill not found in this role');
    }

    if (this.techStacks.length === 0) {
      return Result.fail(
        'Cannot remove last skill - at least one skill is required',
      );
    }

    return Result.ok(undefined);
  }

  public getTechStacks(): TechStack[] {
    return [...this.techStacks];
  }

  public toPrimitive(): ProjectRolePrimitive {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      isFilled: this.isFilled,
      techStacks: this.techStacks.map((ts) => ts.toPrimitive()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
