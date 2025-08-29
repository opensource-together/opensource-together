import { IsNumber, IsString, IsUrl } from 'class-validator';

export class GithubUserDto {
  @IsString()
  login: string;

  @IsNumber()
  id: number;

  @IsString()
  node_id: string;

  @IsUrl()
  avatar_url: string;

  @IsUrl()
  html_url: string;
}
