import { Result } from '@/shared/result';
import { TechStack } from '@/domain/techStack/techstack.entity';

export type ProjectRoleCreateProps = {
  projectId: string;
  roleTitle: string;
  description: string;
  isFilled: boolean;
  skillSet: TechStack[];
};

export type ProjectRoleValidationErrors = {
  projectId?: string;
  roleTitle?: string;
  description?: string;
  isFilled?: string;
  skillSet?: string;
};

export type ProjectRolePrimitive = {
  id?: string;
  projectId: string;
  roleTitle: string;
  description: string;
  isFilled: boolean;
  skillSet: TechStack[];
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * ProjectRole Entity
 *
 * Représente un rôle dans un projet avec ses compétences requises.
 * Cette entité encapsule les propriétés d'un rôle de projet et garantit leur validité
 * à travers des méthodes de validation strictes.
 *
 * @example
 * ```typescript
 * // Création d'un nouveau ProjectRole
 * const projectRole = ProjectRole.create({
 *   projectId: '123',
 *   roleTitle: 'Frontend Developer',
 *   description: 'Responsible for UI development',
 *   isFilled: false,
 *   skillSet: [reactTechStack, typescriptTechStack]
 * });
 *
 * // Reconstitution d'un ProjectRole existant
 * const existingProjectRole = ProjectRole.reconstitute({
 *   id: '456',
 *   projectId: '123',
 *   roleTitle: 'Frontend Developer',
 *   description: 'Responsible for UI development',
 *   isFilled: false,
 *   skillSet: [reactTechStack, typescriptTechStack],
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * });
 * ```
 */
export class ProjectRole {
  private readonly id?: string;
  private readonly projectId: string;
  private roleTitle: string;
  private description: string;
  private isFilled: boolean;
  private skillSet: TechStack[];
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  private constructor(props: {
    id?: string;
    projectId: string;
    roleTitle: string;
    description: string;
    isFilled: boolean;
    skillSet: TechStack[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.roleTitle = props.roleTitle;
    this.description = props.description;
    this.isFilled = props.isFilled;
    this.skillSet = props.skillSet;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public static create(
    props: ProjectRoleCreateProps,
  ): Result<ProjectRole, ProjectRoleValidationErrors | string> {
    const validationResult = this.validate(props);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(
      new ProjectRole({
        projectId: props.projectId,
        roleTitle: props.roleTitle,
        description: props.description,
        isFilled: props.isFilled,
        skillSet: props.skillSet,
      }),
    );
  }

  public static reconstitute(props: {
    id: string;
    projectId: string;
    roleTitle: string;
    description: string;
    isFilled: boolean;
    skillSet: TechStack[];
    createdAt: Date;
    updatedAt: Date;
  }): Result<ProjectRole, ProjectRoleValidationErrors | string> {
    if (!props.id) {
      return Result.fail('Id is required');
    }

    const validationResult = this.validate(props);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(
      new ProjectRole({
        id: props.id,
        projectId: props.projectId,
        roleTitle: props.roleTitle,
        description: props.description,
        isFilled: props.isFilled,
        skillSet: props.skillSet,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      }),
    );
  }

  private static validate(
    props:
      | ProjectRoleCreateProps
      | {
          id?: string;
          projectId: string;
          roleTitle: string;
          description: string;
          isFilled: boolean;
          skillSet: TechStack[];
          createdAt?: Date;
          updatedAt?: Date;
        },
  ): Result<void, ProjectRoleValidationErrors | string> {
    const errors: ProjectRoleValidationErrors = {};

    if (!props.projectId || props.projectId.trim() === '') {
      errors.projectId = 'Project ID is required';
    }

    if (!props.roleTitle || props.roleTitle.trim() === '') {
      errors.roleTitle = 'Role title is required';
    } else if (props.roleTitle.length > 100) {
      errors.roleTitle = 'Role title must be less than 100 characters';
    }

    if (!props.description || props.description.trim() === '') {
      errors.description = 'Description is required';
    } else if (props.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (typeof props.isFilled !== 'boolean') {
      errors.isFilled = 'isFilled must be a boolean';
    }

    if (!props.skillSet || props.skillSet.length === 0) {
      errors.skillSet = 'At least one skill is required';
    }

    if (props.skillSet.some((skill) => !skill.toPrimitive().id)) {
      errors.skillSet = 'Skill ID is required';
    }

    if (Object.keys(errors).length > 0) {
      return Result.fail(errors);
    }

    return Result.ok(undefined);
  }

  public updateRole(props: {
    roleTitle?: string;
    description?: string;
    isFilled?: boolean;
    skillSet?: TechStack[];
  }): Result<void, ProjectRoleValidationErrors | string> {
    const updatedProps = {
      projectId: this.projectId,
      roleTitle: props.roleTitle ?? this.roleTitle,
      description: props.description ?? this.description,
      isFilled: props.isFilled ?? this.isFilled,
      skillSet: props.skillSet ?? this.skillSet,
    };

    const validationResult = ProjectRole.validate(updatedProps);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    if (props.roleTitle !== undefined) this.roleTitle = props.roleTitle;
    if (props.description !== undefined) this.description = props.description;
    if (props.isFilled !== undefined) this.isFilled = props.isFilled;
    if (props.skillSet !== undefined) this.skillSet = props.skillSet;

    return Result.ok(undefined);
  }

  public markAsFilled(): void {
    this.isFilled = true;
  }

  public markAsUnfilled(): void {
    this.isFilled = false;
  }

  public addSkill(techStack: TechStack): Result<void, string> {
    const skillExists = this.skillSet.some(
      (skill) => skill.toPrimitive().id === techStack.toPrimitive().id,
    );

    if (skillExists) {
      return Result.fail('Skill already exists in this role');
    }

    this.skillSet.push(techStack);
    return Result.ok(undefined);
  }

  public removeSkill(techStackId: string): Result<void, string> {
    const initialLength = this.skillSet.length;
    this.skillSet = this.skillSet.filter(
      (skill) => skill.toPrimitive().id !== techStackId,
    );

    if (this.skillSet.length === initialLength) {
      return Result.fail('Skill not found in this role');
    }

    if (this.skillSet.length === 0) {
      return Result.fail(
        'Cannot remove last skill - at least one skill is required',
      );
    }

    return Result.ok(undefined);
  }

  //   // Getters
  //   public getId(): string | undefined {
  //     return this.id;
  //   }

  //   public getProjectId(): string {
  //     return this.projectId;
  //   }

  //   public getRoleTitle(): string {
  //     return this.roleTitle;
  //   }

  //   public getDescription(): string {
  //     return this.description;
  //   }

  //   public getIsFilled(): boolean {
  //     return this.isFilled;
  //   }

  public getSkillSet(): TechStack[] {
    return [...this.skillSet]; // Return copy to maintain immutability
  }

  //   public getCreatedAt(): Date | undefined {
  //     return this.createdAt;
  //   }

  //   public getUpdatedAt(): Date | undefined {
  //     return this.updatedAt;
  //   }

  public toPrimitive(): ProjectRolePrimitive {
    return {
      id: this.id,
      projectId: this.projectId,
      roleTitle: this.roleTitle,
      description: this.description,
      isFilled: this.isFilled,
      skillSet: this.getSkillSet(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
