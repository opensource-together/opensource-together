import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
  IsOptional,
} from 'class-validator';
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

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  forks_count: number;

  @IsNumber()
  watchers_count: number;

  @IsNumber()
  stargazers_count: number;
}
