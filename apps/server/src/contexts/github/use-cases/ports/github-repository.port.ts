import { GithubRepositoryDto } from '@/contexts/github/infrastructure/repositories/dto/github-repository.dto';
import { GithubInvitationDto } from '@/contexts/github/infrastructure/repositories/dto/github-invitation.dto';
// import { CreateGithubRepositoryInput } from '@/application/dto/inputs/create-github-repository-inputs.dto';
import { InviteUserToRepoInput } from '@/contexts/github/infrastructure/repositories/dto/invite-user-to-repo.inputs.dto';
import { Result } from '@/libs/result';
import { Octokit } from '@octokit/rest';

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
  ): Promise<
    Result<{
      forks_count: number;
      stargazers_count: number;
      watchers_count: number;
      open_issues_count: number;
    }>
  >;
  findCommitsByRepository(
    owner: string,
    repo: string,
    octokit: Octokit,
  ): Promise<
    Result<
      {
        lastCommit: {
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
        commitsNumber: number;
      },
      string
    >
  >;
}
