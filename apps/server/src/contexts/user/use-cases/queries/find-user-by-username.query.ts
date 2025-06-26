import { UserRepositoryPort } from '../ports/user.repository.port';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT } from '../ports/user.repository.port';
import { Result } from '@shared/result';
import { User } from '@/contexts/user/domain/user.entity';
export class FindUserByUsernameQuery implements IQuery {
  constructor(public readonly username: string) {}
}

@QueryHandler(FindUserByUsernameQuery)
export class FindUserByUsernameQueryHandler
  implements IQueryHandler<FindUserByUsernameQuery>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(
    query: FindUserByUsernameQuery,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const result: Result<User, { username?: string; email?: string } | string> =
      await this.userRepo.findByUsername(query.username);
    if (!result.success) {
      return Result.fail(result.error);
    }
    return Result.ok(result.value);
  }
}
