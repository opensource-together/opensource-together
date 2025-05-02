import { Result } from '../../shared/result';

const MAX_DESCRIPTION_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 10;
export class Description {
  private constructor(private readonly description: string) {}

  static create(description: string): Result<Description> {
    if (!description) {
      return Result.fail('La description du projet est requise');
    }

      //magic number ‼️
    //pourquoi 100?
    if (description.length > 100) {
      return Result.fail(
        'La description du projet doit comporter au maximum 100 caracteres',
      );
    }

    //magic number ‼️
    //pourquoi 10?
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
    //pas de vérification ?
    return new Description(description);
  }
}
