import { UserRepositoryPort } from '../ports/user.repository.port';
import { User } from '@domain/user/user.entity';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT } from '../ports/user.repository.port';
import { Result } from '@shared/result';
export class FindUserByEmailQuery implements IQuery {
  constructor(public readonly email: string) {}
}

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailQueryHandler
  implements IQueryHandler<FindUserByEmailQuery>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(
    query: FindUserByEmailQuery,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const result: Result<User, { username?: string; email?: string } | string> =
      await this.userRepo.findByEmail(query.email);
    if (!result.success) {
      return Result.fail(result.error);
    }
    return Result.ok(result.value);
  }
}
