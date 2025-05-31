import { GithubRepositoryDto } from "@/application/dto/adapters/github/github-repository.dto";
import { toGithubRepositoryDto } from "@/application/dto/adapters/github/github-repository.adapter";
import { GithubRepositoryPort } from "@/application/github/ports/github-repository.port";
import { Result } from "@/shared/result";
import { Inject, Injectable } from "@nestjs/common";
import { OCTOKIT_PROVIDER } from "../providers/octokit.provider";
import { App } from "octokit";
import { CreateGithubRepositoryInput } from "@/application/dto/inputs/create-github-repository-inputs.dto";
import { GithubInvitationDto } from "@/application/dto/adapters/github/github-invitation.dto";
import { InviteUserToRepoInput } from "@/application/dto/inputs/invite-user-to-repo.inputs.dto";
import { GithubRepositoryPermissionsDto } from "@/application/dto/adapters/github/github-permissions.dto";
import { toGithubInvitationDto } from "@/application/dto/adapters/github/github-invitation.adapter";

@Injectable()
export class GithubRepositoryAdapter implements GithubRepositoryPort {
  constructor(
    @Inject(OCTOKIT_PROVIDER)
    private readonly app: App,
  ) {}

  async createGithubRepository(input: CreateGithubRepositoryInput): Promise<Result<GithubRepositoryDto>> {
    try {
      const octokit = await this.app.getInstallationOctokit(input.installationId); 
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name: input.name,
        description: input.description,
        private: false,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      return toGithubRepositoryDto(response);
    } catch(e) {
      return Result.fail(e); 
    }
  }

  async inviteUserToRepository(input: InviteUserToRepoInput): Promise<Result<GithubInvitationDto>> {
    try {
      const octokit = await this.app.getInstallationOctokit(input.installationId);
      const response = await octokit.rest.repos.addCollaborator({
        owner: input.owner,
        repo: input.repo,
        username: input.username,
        permission: GithubRepositoryPermissionsDto[input.permission],
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      return toGithubInvitationDto(response);
    } catch(e) {
      return Result.fail(e);
    }
  }

}
