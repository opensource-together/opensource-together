import { UserGitHubCredentials } from '@/domain/user/user-github-credentials.entity';
import { Result } from '@/shared/result';

export const USER_GITHUB_CREDENTIALS_REPOSITORY_PORT = Symbol(
  'UserGitHubCredentialsRepository',
);

export interface UserGitHubCredentialsRepositoryPort {
  save(
    credentials: UserGitHubCredentials,
  ): Promise<Result<UserGitHubCredentials, string>>;
  findGhTokenByUserId(userId: string): Promise<Result<string, string>>;
  update(
    credentials: UserGitHubCredentials,
  ): Promise<Result<UserGitHubCredentials, string>>;
}
