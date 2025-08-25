import { Octokit } from '@octokit/rest';
import { IsString } from 'class-validator';

export class CreateGithubRepositoryInput {
  @IsString()
  name: string;

  @IsString()
  description: string;

  octokit: Octokit;
}
