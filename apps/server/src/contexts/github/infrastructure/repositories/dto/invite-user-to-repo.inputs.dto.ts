import { GithubRepositoryPermissionsDto } from './github-permissions.dto';

export class InviteUserToRepoInput {
  owner: string;
  repo: string;
  username: string;
  permission: GithubRepositoryPermissionsDto;
}
