import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@application/ports/user.repository.port';
import { Result } from '@shared/result';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindEmailByUsernameQuery } from '@infrastructures/cqrs/user/queries/find-email-by-username.query';
@QueryHandler(FindEmailByUsernameQuery)
export class FindEmailByUsernameHandler
  implements IQueryHandler<FindEmailByUsernameQuery>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(query: FindEmailByUsernameQuery): Promise<Result<string>> {
    const user = await this.userRepo.findByUsername(query.username);

    if (!user) return Result.fail('Identifiants incorrects');

    return Result.ok(user.getEmail());
  }
}
