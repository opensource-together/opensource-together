import { GithubRepositoryPermissionsDto } from '../adapters/github/github-permissions.dto';

export class InviteUserToRepoInput {
  installationId: number;
  owner: string;
  repo: string;
  username: string;
  permission: GithubRepositoryPermissionsDto;
}
