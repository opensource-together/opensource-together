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
      console.log('response', response);
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
      return Result.fail(e);
    }
  }
}
