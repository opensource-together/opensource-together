import { Result } from '@shared/result';

export class Title {
  private static readonly MAX_LENGTH = 100;
  private static readonly MIN_LENGTH = 3;
  private constructor(private readonly value: string) {
    this.value = value;
  }

  static create(title: string): Result<Title, string> {
    if (!title || title.trim() === '') {
      return Result.fail('Title is required');
    }
    if (title.length < Title.MIN_LENGTH) {
      return Result.fail('Title must be at least 3 characters');
    }
    if (title.length > Title.MAX_LENGTH) {
      return Result.fail('Title must be less than 100 characters');
    }
    return Result.ok(new Title(title));
  }
  getTitle(): string {
    return this.value;
  }
}
