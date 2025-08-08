import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import { GitHubStats } from '@/contexts/user/domain/github-stats.vo';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../ports/user.repository.port';

export class FindUserGitHubStatsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FindUserGitHubStatsQuery)
export class FindUserGitHubStatsQueryHandler
  implements IQueryHandler<FindUserGitHubStatsQuery>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(
    query: FindUserGitHubStatsQuery,
  ): Promise<Result<GitHubStats | null, string>> {
    const userResult = await this.userRepo.findById(query.userId);

    if (!userResult.success) {
      return Result.fail('User not found');
    }

    const user = userResult.value;
    const githubStats = user.getGitHubStats();

    return Result.ok(githubStats || null);
  }
}
