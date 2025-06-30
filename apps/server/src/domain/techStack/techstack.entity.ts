import { Result } from '@/shared/result';

export type TechStackCreateProps = {
  name: string;
  iconUrl: string;
};

export type TechStackValidationErrors = {
  id?: string;
  name?: string;
  iconUrl?: string;
};

export type TechStackPrimitive = {
  id?: string;
  name: string;
  iconUrl: string;
};

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
  private readonly id: string | undefined;
  private name: string;
  private iconUrl: string;

  constructor(props: {
    id: string | undefined;
    name: string;
    iconUrl: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.iconUrl = props.iconUrl;
  }

  public static create(
    props: TechStackCreateProps,
  ): Result<TechStack, TechStackValidationErrors | string> {
    return TechStack.validate(props);
  }
  public static reconstitute(props: {
    id: string;
    name: string;
    iconUrl: string;
  }): Result<TechStack, TechStackValidationErrors | string> {
    if (!props.id) {
      return Result.fail('Id is required');
    }
    return TechStack.validate(props);
  }
  public static validate(
    props:
      | TechStackCreateProps
      | {
          id: string;
          name: string;
          iconUrl: string;
        },
  ): Result<TechStack, TechStackValidationErrors | string> {
    const error: { id?: string; name?: string; iconUrl?: string } = {};
    if (!props.name || props.name.trim() === '') {
      error.name = 'Name is required';
    }
    if (!props.iconUrl) {
      error.iconUrl = 'Icon URL is required';
    }
    if (Object.keys(error).length > 0) {
      return Result.fail(error);
    }
    return Result.ok(
      new TechStack({
        id: 'id' in props ? props.id : undefined,
        name: props.name,
        iconUrl: props.iconUrl,
      }),
    );
  }

  public toPrimitive(): TechStackPrimitive {
    return {
      id: this.id,
      name: this.name,
      iconUrl: this.iconUrl,
    };
  }
}
