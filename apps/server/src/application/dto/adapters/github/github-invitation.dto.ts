import { GithubRepositoryPermissionsDto } from './github-permissions.dto';
import { GithubRepositoryDto } from './github-repository.dto';
import { GithubUserDto } from './github-user.dto';

export class GithubInvitationDto {
  id: number;
  node_id: string;
  repository: GithubRepositoryDto;
  invitee: GithubUserDto;
  inviter: GithubUserDto;
  permissions: GithubRepositoryPermissionsDto;
  html_url: string;
}
