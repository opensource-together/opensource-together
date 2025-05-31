import { GithubRepositoryDto } from "@/application/dto/adapters/github/github-repository.dto";
import { GithubInvitationDto } from "@/application/dto/adapters/github/github-invitation.dto";
import { CreateGithubRepositoryInput } from "@/application/dto/inputs/create-github-repository-inputs.dto";
import { InviteUserToRepoInput } from "@/application/dto/inputs/invite-user-to-repo.inputs.dto";
import { Result } from "@/shared/result";

export const GITHUB_REPOSITORY_PORT = Symbol('GITHUB_REPOSITORY_PORT')
export interface GithubRepositoryPort {
  createGithubRepository(input: CreateGithubRepositoryInput): Promise<Result<GithubRepositoryDto>>;
  inviteUserToRepository(input: InviteUserToRepoInput): Promise<Result<GithubInvitationDto>>;
}
