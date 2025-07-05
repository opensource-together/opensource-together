import { Result } from '@/libs/result';

export type DifficultyValidationErrors = {
  required?: string;
  invalid?: string;
};
export type DifficultyType = 'easy' | 'medium' | 'hard';
export class Difficulty {
  private readonly difficulty: DifficultyType;
  private constructor(difficulty: DifficultyType) {
    this.difficulty = difficulty;
  }

  static create(
    difficulty: string,
  ): Result<Difficulty, DifficultyValidationErrors | string> {
    const error: DifficultyValidationErrors = {};
    if (!difficulty) {
      error.required = 'Difficulty is required';
    }
    if (
      difficulty !== 'easy' &&
      difficulty !== 'medium' &&
      difficulty !== 'hard'
    ) {
      error.invalid = 'Difficulty must be easy, medium, or hard';
    }
    if (Object.keys(error).length > 0) {
      return Result.fail(error);
    }
    return Result.ok(new Difficulty(difficulty as DifficultyType));
  }

  public getDifficulty(): DifficultyType {
    return this.difficulty;
  }
}
