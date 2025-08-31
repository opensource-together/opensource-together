import { Result } from '@/libs/result';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export interface IUserRepository {
  updateGithubLogin(
    userId: string,
    githubLogin: string,
  ): Promise<Result<void, string>>;
}
