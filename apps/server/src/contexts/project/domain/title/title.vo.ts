import { Result } from '@/shared/result';

export class Title {
  private constructor(private readonly title: string) {}

  static create(title: string): Result<Title> {
    if (!title) {
      return Result.fail('Le titre du projet est requis');
    }

    if (title.length > 20) {
      return Result.fail(
        'Le titre du projet doit comporter au maximum 20 caracteres',
      );
    }

    if (title.length < 2) {
      return Result.fail(
        'Le titre du projet doit comporter au minimum 2 caracteres',
      );
    }
    return Result.ok(new Title(title));
  }

  public getTitle(): string {
    return this.title;
  }

  static fromPersistence(title: string): Title {
    if (title.length > 20) {
      throw new Error(
        'Le titre du projet doit comporter au maximum 20 caracteres',
      );
    }
    if (title.length < 2) {
      throw new Error(
        'Le titre du projet doit comporter au minimum 2 caracteres',
      );
    }
    return new Title(title);
  }
}
