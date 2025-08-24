import { GithubRepositoryDto } from '@/features/github/services/dto/github-repository.dto';
import { GithubInvitationDto } from '@/features/github/services/dto/github-invitation.dto';
import { InviteUserToRepoInput } from '@/features/github/services/inputs/invite-user-to-repo.input';
import { GithubRepoSuggestionInput } from '@/features/github/services/inputs/github-repo-suggestion.input';
import { Result } from '@/libs/result';
import { Octokit } from '@octokit/rest';
//import { ContributionGraph } from '@/contexts/user/domain/github-stats.vo';

export type LastCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
};
export type Contributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};
export type Author = {
  login: string;
  avatar_url: string;
  html_url: string;
};
export type RepositoryInfo = {
  forks: number;
  stars: number;
  watchers: number;
  openIssues: number;
};
export const GITHUB_REPOSITORY = Symbol('GITHUB_REPOSITORY');
export interface IGithubRepository {
  createGithubRepository(
    input: {
      title: string;
      description: string;
    },
    octokit: Octokit,
  ): Promise<Result<GithubRepositoryDto>>;
  inviteUserToRepository(
    input: InviteUserToRepoInput,
    octokit: Octokit,
  ): Promise<Result<GithubInvitationDto>>;
  findRepositoryByOwnerAndName(
    owner: string,
    name: string,
    octokit: Octokit,
  ): Promise<Result<RepositoryInfo, string>>;
  findCommitsByRepository(
    owner: string,
    repo: string,
    octokit: Octokit,
  ): Promise<
    Result<
      {
        lastCommit: LastCommit | null;
        commitsNumber: number;
      },
      string
    >
  >;
  findContributorsByRepository(
    owner: string,
    repo: string,
    octokit: Octokit,
  ): Promise<Result<Array<Contributor>, string>>;
  findRepositoriesOfAuthenticatedUser(
    octokit: Octokit,
  ): Promise<Result<GithubRepoSuggestionInput[], string>>;

  getUserTotalStars(octokit: Octokit): Promise<Result<number, string>>;
  getUserContributedRepos(octokit: Octokit): Promise<Result<number, string>>;
  getUserCommitsLastYear(octokit: Octokit): Promise<Result<number, string>>;
  /*getUserContributionGraph(
    octokit: Octokit,
  ): Promise<Result<ContributionGraph, string>>;*/
}
