import { Result } from '@/shared/result';

export class Status {
  private constructor(private readonly status: 'Active' | 'Archived') {}

  static create(status: 'Active' | 'Archived'): Result<Status> {
    if (!status) {
      return Result.fail('Status is required');
    }

    if (status !== 'Active' && status !== 'Archived') {
      return Result.fail('Status must be Active or Archived');
    }
    return Result.ok(new Status(status));
  }

  public getStatus(): string {
    return this.status;
  }

  static fromPersistence(status: 'Active' | 'Archived'): Status {
    return new Status(status);
  }
}
