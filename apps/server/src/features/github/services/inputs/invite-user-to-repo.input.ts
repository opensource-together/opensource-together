import { IsString, ValidateNested } from 'class-validator';
import { GithubRepositoryPermissionsDto } from '../dto/github-permissions.dto';
import { Octokit } from '@octokit/rest';

export class InviteUserToRepoInput {
  @IsString()
  owner: string;

  @IsString()
  repo: string;

  @IsString()
  username: string;

  @ValidateNested()
  permission: GithubRepositoryPermissionsDto;

  octokit: Octokit;
}
