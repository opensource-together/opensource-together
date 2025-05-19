import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT } from '../ports/user.repository.port';
import { Result } from '@shared/result';
import { User } from '@domain/user/user.entity';
export class FindUserByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(
    query: FindUserByIdQuery,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const result: Result<User, { username?: string; email?: string } | string> =
      await this.userRepo.findById(query.id);
    if (!result.success) {
      return Result.fail(result.error);
    }
    return Result.ok(result.value);
  }
}
