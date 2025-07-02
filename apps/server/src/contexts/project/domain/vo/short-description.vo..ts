import { Result } from '@shared/result';

export class ShortDescription {
  private constructor(private readonly description: string) {}

  static create(shortDescription: string): Result<ShortDescription, string> {
    if (!shortDescription || shortDescription.trim() === '') {
      return Result.fail('Short description is required');
    }
    if (shortDescription.length > 100) {
      return Result.fail('Short description must be less than 100 characters');
    }
    return Result.ok(new ShortDescription(shortDescription));
  }

  public getShortDescription(): string {
    return this.description;
  }
}
