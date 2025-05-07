import { Result } from '@/shared/result';

export class Status {
  private constructor(private readonly status: string) {}

  static create(status: string): Result<Status> {
    if (status !== 'PUBLISHED' && status !== 'ARCHIVED' && status !== 'DRAFT') {
      return Result.fail('Status must be PUBLISHED or ARCHIVED or DRAFT');
    }
    return Result.ok(new Status(status));
  }

  public getStatus(): string {
    return this.status;
  }

  static fromPersistence(status: string): Status {
    if (status !== 'PUBLISHED' && status !== 'ARCHIVED' && status !== 'DRAFT') {
      throw new Error('Status must be PUBLISHED or ARCHIVED or DRAFT');
    }
    return new Status(status);
  }
}
