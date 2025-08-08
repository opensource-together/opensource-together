import { GithubRepositoryDto } from '@/contexts/github/infrastructure/repositories/dto/github-repository.dto';
import { GithubInvitationDto } from '@/contexts/github/infrastructure/repositories/dto/github-invitation.dto';
// import { CreateGithubRepositoryInput } from '@/application/dto/inputs/create-github-repository-inputs.dto';
import { InviteUserToRepoInput } from '@/contexts/github/infrastructure/repositories/inputs/invite-user-to-repo.inputs.dto';
import { Result } from '@/libs/result';
import { Octokit } from '@octokit/rest';
import { GithubRepoListInput } from '../../infrastructure/repositories/inputs/github-repo-list.input';
import { ContributionGraph } from '@/contexts/user/domain/github-stats.vo';

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
export const GITHUB_REPOSITORY_PORT = Symbol('GITHUB_REPOSITORY_PORT');
export interface GithubRepositoryPort {
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
  ): Promise<Result<GithubRepoListInput[], string>>;

  // Nouvelles méthodes pour les statistiques utilisateur
  getUserTotalStars(octokit: Octokit): Promise<Result<number, string>>;
  getUserContributedRepos(octokit: Octokit): Promise<Result<number, string>>;
  getUserCommitsLastYear(octokit: Octokit): Promise<Result<number, string>>;
  getUserContributionGraph(
    octokit: Octokit,
  ): Promise<Result<ContributionGraph, string>>;
}
