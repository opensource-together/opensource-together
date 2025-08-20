import { Result } from '@/libs/result';

export const USER_GITHUB_CREDENTIALS_REPOSITORY = Symbol(
  'UserGitHubCredentialsRepository',
);

export type UserGitHubCredentialsData = {
  userId: string;
  githubUserId: string;
  githubAccessToken: string;
};

export interface IUserGitHubCredentialsRepository {
  create(
    props: UserGitHubCredentialsData,
  ): Promise<Result<UserGitHubCredentialsData, string>>;

  findGhTokenByUserId(userId: string): Promise<Result<string, string>>;

  update(
    props: UserGitHubCredentialsData,
  ): Promise<Result<UserGitHubCredentialsData, string>>;
}
