import { Result } from "@/libs/result";

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');
export interface IAccountRepository {
  getUserGithubToken(userId: string): Promise<Result<string>>;
}
