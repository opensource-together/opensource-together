import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { USER_REPOSITORY_PORT } from '../ports/user.repository.port';
import { Inject } from '@nestjs/common';

export class UserExistQuery implements IQuery {
  constructor(
    public readonly username: string,
    public readonly email: string,
  ) {}
}

@QueryHandler(UserExistQuery)
export class UserExistHandler implements IQueryHandler<UserExistQuery> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(query: UserExistQuery): Promise<boolean> {
    const userExistsByUsername = await this.userRepo.findByUsername(
      query.username,
    );
    const userExistsByEmail = await this.userRepo.findByEmail(query.email);

    if (userExistsByUsername.success || userExistsByEmail.success) {
      return true;
    }
    return false;
  }
}
