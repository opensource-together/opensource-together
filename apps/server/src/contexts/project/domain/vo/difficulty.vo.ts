import { Result } from '@/libs/result';

export class Difficulty {
  private constructor(private readonly difficulty: string) {}

  static create(difficulty: string): Result<Difficulty, string> {
    if (!difficulty) {
      return Result.fail('Difficulty is required');
    }
    if (
      difficulty !== 'easy' &&
      difficulty !== 'medium' &&
      difficulty !== 'hard'
    ) {
      return Result.fail('Difficulty must be easy, medium or hard');
    }
    return Result.ok(new Difficulty(difficulty));
  }
}
