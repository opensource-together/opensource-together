import { User } from '@/contexts/user/domain/user.entity';
import { Result } from '@/shared/result';
export const USER_REPOSITORY_PORT = Symbol('UserRepository');
export interface UserRepositoryPort {
  create(user: {
    id: string;
    username: string;
    email: string;
  }): Promise<Result<User, { username?: string; email?: string } | string>>;
  findByUsername(
    username: string,
  ): Promise<Result<User, { username?: string; email?: string } | string>>;
  findByEmail(
    email: string,
  ): Promise<Result<User, { username?: string; email?: string } | string>>;
  findById(
    id: string,
  ): Promise<Result<User, { username?: string; email?: string } | string>>;
  update(
    user: User,
  ): Promise<Result<User, { username?: string; email?: string } | string>>;
  delete(user: User): Promise<Result<void, string>>;
}
