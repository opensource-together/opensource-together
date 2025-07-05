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
}
