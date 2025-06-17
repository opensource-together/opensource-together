import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../ports/user.repository.port';
import { Inject } from '@nestjs/common';
import { Result } from '@/shared/result';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';

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
  ): Promise<
    Result<UserResponseDto, { username?: string; email?: string } | string>
  > {
    const result = await this.userRepo.findById(query.id);

    if (!result.success) {
      return Result.fail('User not found');
    }

    return Result.ok(UserMapper.toDto(result.value));
  }
}
