export class GithubUserInfoDto {
  user: {
    id: number;
    login: string;
    avatar_url: string;
    bio: string;
    html_url: string;
  }
}
