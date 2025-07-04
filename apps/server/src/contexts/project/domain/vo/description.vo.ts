import { Result } from '@shared/result';

export class Description {
  private constructor(private readonly value: string) {}

  static create(description: string): Result<Description, string> {
    if (!description || description.trim() === '') {
      return Result.fail('Description is required');
    }
    if (description.length > 1000) {
      return Result.fail('Description must be less than 1000 characters');
    }
    return Result.ok(new Description(description));
  }

  public getDescription(): string {
    return this.value;
  }
}
