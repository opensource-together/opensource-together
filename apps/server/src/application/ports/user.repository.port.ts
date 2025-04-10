import { User } from '@domain/user/user.entity';
export const USER_REPOSITORY_PORT = Symbol('UserRepository');
export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
