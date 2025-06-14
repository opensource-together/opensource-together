import { Result } from '@shared/result';
export class Username {
  private constructor(private readonly username: string) {}

  static create(username: string): Result<Username> {
    if(!username) {
      return Result.fail('Username cannot be undefined');
    }
    if (username.length < 3) {
      return Result.fail('Username must be at least 3 characters long');
    }
    if (!username.match(/^[a-zA-Z0-9_-]+$/)) {
      return Result.fail(
        'Username must contain only alphanumeric, underscore or hyphen characters.',
      );
    }

    return Result.ok(new Username(username));
  }

  public getUsername(): string {
    return this.username;
  }

  public static fromPersistence(username: string): Username {
    return new Username(username);
  }
}
