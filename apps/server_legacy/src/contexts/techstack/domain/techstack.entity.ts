import { Result } from '@/libs/result';

export type TechStackData = {
  id: string;
  name: string;
  iconUrl: string;
  type: 'LANGUAGE' | 'TECH';
};
export type TechStackValidationErrors = {
  id?: string;
  name?: string;
  iconUrl?: string;
  type?: string;
};

export type TechStackPrimitive = TechStackData;

/**
 * TechStack Entity
 *
 * Représente une technologie utilisée dans un projet (ex: React, Node.js, PostgreSQL).
 * Cette entité encapsule les propriétés d'une stack technique et garantit leur validité
 * à travers des méthodes de validation strictes.
 *
 * @example
 * ```typescript
 * // Création d'une nouvelle TechStack
 * const techStack = TechStack.create({
 *   name: 'React',
 *   iconUrl: 'https://reactjs.org/favicon.ico'
 * });
 *
 * // Reconstitution d'une TechStack existante
 * const existingTechStack = TechStack.reconstitute({
 *   id: '123',
 *   name: 'React',
 *   iconUrl: 'https://reactjs.org/favicon.ico'
 * });
 * ```
 */

export class TechStack {
  private readonly id: string;
  private name: string;
  private iconUrl: string;
  private type: 'LANGUAGE' | 'TECH';

  private constructor(props: {
    id: string;
    name: string;
    iconUrl: string;
    type: 'LANGUAGE' | 'TECH';
  }) {
    this.id = props.id;
    this.name = props.name;
    this.iconUrl = props.iconUrl;
    this.type = props.type;
  }

  public static reconstitute(
    props: TechStackData,
  ): Result<TechStack, TechStackValidationErrors | string> {
    const validationResult = TechStack.validate(props);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }
    return Result.ok(new TechStack(props));
  }

  public static validate(
    props: TechStackData,
  ): Result<TechStack, TechStackValidationErrors | string> {
    const error: {
      id?: string;
      name?: string;
      iconUrl?: string;
      type?: string;
    } = {};
    if (!props.id) {
      error.id = 'Id is required';
    }
    if (!props.name || props.name.trim() === '') {
      error.name = 'Name is required';
    }
    if (!props.iconUrl) {
      error.iconUrl = 'Icon URL is required';
    }
    if (!props.type || (props.type !== 'LANGUAGE' && props.type !== 'TECH')) {
      error.type = 'Type must be LANGUAGE or TECH';
    }
    if (Object.keys(error).length > 0) {
      return Result.fail(error);
    }
    return Result.ok(new TechStack(props));
  }

  public static reconstituteMany(
    props: TechStackData[],
  ): Result<TechStack[], TechStackValidationErrors | string> {
    const techStacks = props.map((p) => TechStack.reconstitute(p));
    if (!techStacks.every((ts) => ts.success)) {
      return Result.fail('Tech stacks not found');
    }
    return Result.ok(techStacks.map((ts) => ts.value));
  }

  public toPrimitive(): TechStackPrimitive {
    return {
      id: this.id,
      name: this.name,
      iconUrl: this.iconUrl,
      type: this.type,
    };
  }

  public mapToPrimitive(techStacks: TechStack[]): TechStackPrimitive[] {
    return techStacks.map((ts) => ts.toPrimitive());
  }
}
