export class GitHubUserInfoDto {
  id: string;
  login: string;
  name: string;
  email: string;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  company: string | null;

  constructor(partial: Partial<GitHubUserInfoDto>) {
    Object.assign(this, partial);
  }
}
