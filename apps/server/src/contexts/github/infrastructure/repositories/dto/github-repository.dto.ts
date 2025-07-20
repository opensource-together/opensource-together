import { GithubUserDto } from './github-user.dto';

export type GithubRepositoryDto = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: GithubUserDto;
  html_url: string;
  description: string;
  forks_count: number;
  subscribers_count: number;
  stargazers_count: number;
};
