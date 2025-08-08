import { User } from '@/contexts/user/domain/user.entity';
import { Result } from '@/libs/result';

export const USER_REPOSITORY_PORT = Symbol('UserRepository');

export interface UserRepositoryPort {
  create(user: User): Promise<Result<User, string>>;
  findByUsername(username: string): Promise<Result<User, string>>;
  findByEmail(email: string): Promise<Result<User, string>>;
  findById(id: string): Promise<Result<User, string>>;
  update(user: User): Promise<Result<User, string>>;
  delete(user: User): Promise<Result<void, string>>;
  updateTechStacks(
    userId: string,
    techStackIds: string[],
  ): Promise<Result<User, string>>;
  updateGitHubStats(
    userId: string,
    githubStats: {
      totalStars: number;
      contributedRepos: number;
      commitsThisYear: number;
    },
  ): Promise<Result<User, string>>;
}
