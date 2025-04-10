import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@application/ports/user.repository.port';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserExistQuery } from '@infrastructures/cqrs/user/queries/user-exist.query';
@QueryHandler(UserExistQuery)
export class UserExistHandler implements IQueryHandler<UserExistQuery> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(query: UserExistQuery): Promise<boolean> {
    const userExists = await this.userRepo.findByUsername(query.username);
    const userExistsByEmail = await this.userRepo.findByEmail(query.email);

    if (userExists || userExistsByEmail) {
      return true;
    }
    return false;
  }
}
