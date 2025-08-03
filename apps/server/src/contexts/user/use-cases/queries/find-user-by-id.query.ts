import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../ports/user.repository.port';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import { User, UserPublic } from '@/contexts/user/domain/user.entity';

export class FindUserByIdQuery implements IQuery {
  constructor(
    public readonly props: {
      userId: string;
      authenticatedUserId: string;
    },
  ) {}
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
  ): Promise<Result<User | UserPublic, string>> {
    const { userId, authenticatedUserId } = query.props;
    const result = await this.userRepo.findById(userId);

    console.log('result', result);
    if (!result.success) {
      return Result.fail('User not found');
    }

    if (userId !== authenticatedUserId) {
      result.value.hideEmail(true);
      result.value.hideLogin(true);
    }

    return Result.ok(result.value);
  }
}
