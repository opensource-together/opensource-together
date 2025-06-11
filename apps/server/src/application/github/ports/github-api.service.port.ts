import { Result } from '@/shared/result';

export const GITHUB_API_SERVICE_PORT = Symbol('GitHubApiService');

export interface GitHubApiServicePort {
  createRepository(
    token: string,
    repoData: { name: string; description?: string; isPrivate?: boolean },
  ): Promise<Result<any, string>>;
}
