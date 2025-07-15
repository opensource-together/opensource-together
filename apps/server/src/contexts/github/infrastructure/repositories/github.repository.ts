import { GithubRepositoryDto } from './dto/github-repository.dto';
import { toGithubRepositoryDto } from './dto/github-repository.adapter';
import { GithubRepositoryPort } from '@/contexts/github/use-cases/ports/github-repository.port';
import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
// import { CreateGithubRepositoryInput } from '@/application/dto/inputs/create-github-repository-inputs.dto';
import { GithubInvitationDto } from './dto/github-invitation.dto';
import { InviteUserToRepoInput } from '@/contexts/github/infrastructure/repositories/dto/invite-user-to-repo.inputs.dto';
import { GithubRepositoryPermissionsDto } from './dto/github-permissions.dto';
import { toGithubInvitationDto } from './dto/github-invitation.adapter';

@Injectable()
export class GithubRepository implements GithubRepositoryPort {
  constructor() {}

  async createGithubRepository(
    input: {
      title: string;
      description: string;
    },
    octokit: Octokit,
  ): Promise<Result<GithubRepositoryDto>> {
    try {
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name: input.title,
        description: input.description,
        private: false,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return toGithubRepositoryDto(response);
    } catch (e) {
      console.log('e', e);
      return Result.fail('Failed to create github repository');
    }
  }

  async inviteUserToRepository(
    input: InviteUserToRepoInput,
    octokit: Octokit,
  ): Promise<Result<GithubInvitationDto>> {
    try {
      const response = await octokit.rest.repos.addCollaborator({
        owner: input.owner,
        repo: input.repo,
        username: input.username,
        permission: GithubRepositoryPermissionsDto[input.permission],
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return toGithubInvitationDto(response);
    } catch (e) {
      console.log('e', e);
      return Result.fail('Failed to invite user to repository');
    }
  }

  async findRepositoryByOwnerAndName(
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
  > {
    try {
      const response = await octokit.rest.repos.get({
        owner,
        repo: name,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return Result.ok(response.data);
    } catch (e) {
      console.log('e', e);
      return Result.fail('Failed to fetch repository');
    }
  }

  async findCommitsByRepository(
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
  > {
    try {
      const response = await octokit.rest.repos.listCommits({
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      const rawCommit = response.data[0];
      const lastCommit = {
        sha: rawCommit.sha,
        message: rawCommit.commit.message,
        date: rawCommit.commit.author?.date as string,
        url: rawCommit.html_url,
        author: {
          login: rawCommit.author?.login as string,
          avatar_url: rawCommit.author?.avatar_url as string,
          html_url: rawCommit.author?.html_url as string,
        },
      };
      const commitsNumber = response.data.length;

      return Result.ok({
        lastCommit,
        commitsNumber,
      });
    } catch (e) {
      console.log('e', e);
      return Result.fail('Failed to fetch commits');
    }
  }

  async findContributorsByRepository(
    owner: string,
    repo: string,
    octokit: Octokit,
  ): Promise<
    Result<
      Array<{
        login: string;
        avatar_url: string;
        html_url: string;
        contributions: number;
      }>,
      string
    >
  > {
    try {
      const response = await octokit.rest.repos.listContributors({
        owner,
        repo,
      });
      const contributors = response.data.map((contributor) => ({
        login: contributor.login as string,
        avatar_url: contributor.avatar_url as string,
        html_url: contributor.html_url as string,
        contributions: contributor.contributions,
      }));
      return Result.ok(contributors);
    } catch (e) {
      console.log('e', e);
      return Result.fail('Failed to fetch contributors');
    }
  }
}
