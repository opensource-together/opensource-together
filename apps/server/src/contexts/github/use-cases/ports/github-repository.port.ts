import { GithubRepositoryDto } from '@/application/dto/adapters/github/github-repository.dto';
import { GithubInvitationDto } from '@/application/dto/adapters/github/github-invitation.dto';
import { CreateGithubRepositoryInput } from '@/application/dto/inputs/create-github-repository-inputs.dto';
import { InviteUserToRepoInput } from '@/application/dto/inputs/invite-user-to-repo.inputs.dto';
import { Result } from '@/shared/result';
import { Octokit } from '@octokit/rest';

export const GITHUB_REPOSITORY_PORT = Symbol('GITHUB_REPOSITORY_PORT');
export interface GithubRepositoryPort {
  createGithubRepository(
    input: CreateGithubRepositoryInput,
    octokit: Octokit,
  ): Promise<Result<GithubRepositoryDto>>;
  inviteUserToRepository(
    input: InviteUserToRepoInput,
    octokit: Octokit,
  ): Promise<Result<GithubInvitationDto>>;
}
