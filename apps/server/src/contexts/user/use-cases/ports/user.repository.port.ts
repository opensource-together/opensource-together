import { User } from '@/contexts/user/domain/user.entity';
import { Result } from '@/libs/result';
export const USER_REPOSITORY_PORT = Symbol('UserRepository');
export interface UserRepositoryPort {
  create(user: User): Promise<Result<User, string>>;
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
