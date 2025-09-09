import { IsString, IsOptional } from 'class-validator';

export class GithubRepoSuggestionInput {
  @IsString()
  owner: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  readme?: string;
}
