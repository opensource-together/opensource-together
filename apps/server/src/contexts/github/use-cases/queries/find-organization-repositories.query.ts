import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Octokit } from '@octokit/rest';
import { GithubRepoListInput } from '../../infrastructure/repositories/inputs/github-repo-list.input';
import {
  GITHUB_REPOSITORY_PORT,
  GithubRepositoryPort,
} from '../ports/github-repository.port';

export class FindOrganizationRepositoriesQuery implements IQuery {
  constructor(public readonly octokit: Octokit) {}
}

@QueryHandler(FindOrganizationRepositoriesQuery)
export class FindOrganizationRepositoriesQueryHandler
  implements IQueryHandler<FindOrganizationRepositoriesQuery>
{
  constructor(
    @Inject(GITHUB_REPOSITORY_PORT)
    private readonly githubRepository: GithubRepositoryPort,
  ) {}

  async execute(
    query: FindOrganizationRepositoriesQuery,
  ): Promise<Result<GithubRepoListInput[], string>> {
    return this.githubRepository.findRepositoriesOfOrganizations(query.octokit);
  }
}
