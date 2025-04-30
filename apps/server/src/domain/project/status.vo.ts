import { ProjectStatus } from '@prisma/client';
import { Result } from '@/shared/result';

export class Status {
  private constructor(private readonly status: ProjectStatus) {}

  static create(status: ProjectStatus): Result<Status> {
    if (status !== 'PUBLISHED' && status !== 'ARCHIVED' && status !== 'DRAFT') {
      return Result.fail('Status must be PUBLISHED or ARCHIVED or DRAFT');
    }
    return Result.ok(new Status(status));
  }

  public getStatus(): ProjectStatus | null {
    return this.status;
  }

  static fromPersistence(status: ProjectStatus): Status {
    return new Status(status);
  }
}
