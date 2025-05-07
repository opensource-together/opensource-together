import { Result } from '@/shared/result';

export class Description {
  private constructor(private readonly description: string) {}

  static create(description: string): Result<Description> {
    if (!description) {
      return Result.fail('La description du projet est requise');
    }

    if (description.length > 100) {
      return Result.fail(
        'La description du projet doit comporter au maximum 100 caracteres',
      );
    }

    if (description.length < 10) {
      return Result.fail(
        'La description du projet doit comporter au minimum 10 caracteres',
      );
    }
    return Result.ok(new Description(description));
  }

  public getDescription(): string {
    return this.description;
  }

  static fromPersistence(description: string): Description {
    if (description.length > 100) {
      throw new Error(
        'La description du projet doit comporter au maximum 100 caracteres',
      );
    }
    if (description.length < 10) {
      throw new Error(
        'La description du projet doit comporter au minimum 10 caracteres',
      );
    }
    return new Description(description);
  }
}
