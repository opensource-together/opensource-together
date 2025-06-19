import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/shared/result';
import {
  USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
  UserGitHubCredentialsRepositoryPort,
} from '../ports/user-github-credentials.repository.port';

export interface GitHubCredentials {
  userId: string;
  githubAccessToken: string;
  githubUserId: string;
}

export class FindUserGitHubCredentialsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FindUserGitHubCredentialsQuery)
export class FindUserGitHubCredentialsQueryHandler
  implements IQueryHandler<FindUserGitHubCredentialsQuery>
{
  constructor(
    @Inject(USER_GITHUB_CREDENTIALS_REPOSITORY_PORT)
    private readonly userGitHubCredentialsRepo: UserGitHubCredentialsRepositoryPort,
  ) {}

  async execute(
    query: FindUserGitHubCredentialsQuery,
  ): Promise<Result<GitHubCredentials, string>> {
    const userResult = await this.userGitHubCredentialsRepo.findGhTokenByUserId(
      query.userId,
    );

    if (!userResult.success) {
      return Result.fail('User not found');
    }

    const credentials: GitHubCredentials = {
      userId: query.userId,
      githubAccessToken: userResult.value,
      githubUserId: '',
    };

    return Result.ok(credentials);
  }
}
