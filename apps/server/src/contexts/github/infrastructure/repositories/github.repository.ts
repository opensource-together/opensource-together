import { GithubRepositoryDto } from '@/application/dto/adapters/github/github-repository.dto';
import { toGithubRepositoryDto } from '@/application/dto/adapters/github/github-repository.adapter';
import { GithubRepositoryPort } from '@/contexts/github/use-cases/ports/github-repository.port';
import { Result } from '@/shared/result';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
// import { CreateGithubRepositoryInput } from '@/application/dto/inputs/create-github-repository-inputs.dto';
import { GithubInvitationDto } from '@/application/dto/adapters/github/github-invitation.dto';
import { InviteUserToRepoInput } from '@/application/dto/inputs/invite-user-to-repo.inputs.dto';
import { GithubRepositoryPermissionsDto } from '@/application/dto/adapters/github/github-permissions.dto';
import { toGithubInvitationDto } from '@/application/dto/adapters/github/github-invitation.adapter';

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
      console.log('response', response);
      return toGithubRepositoryDto(response);
    } catch (e) {
      return Result.fail(e);
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
      return Result.fail(e);
    }
  }
}
