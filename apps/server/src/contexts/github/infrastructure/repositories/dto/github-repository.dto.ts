import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUrl, ValidateNested } from 'class-validator';
import { GithubUserDto } from './github-user.dto';

export class GithubRepositoryDto {
  @IsNumber()
  id: number;

  @IsString()
  node_id: string;

  @IsString()
  name: string;

  @IsString()
  full_name: string;

  @ValidateNested()
  @Type(() => GithubUserDto)
  owner: GithubUserDto;

  @IsUrl()
  html_url: string;

  @IsString()
  description: string;

  @IsNumber()
  forks_count: number;

  @IsNumber()
  subscribers_count: number;

  @IsNumber()
  stargazers_count: number;
}
