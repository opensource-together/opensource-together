import { UserRepositoryPort } from '@/application/user/ports/user.repository.port';
import { Result } from '@/shared/result';
import { User } from '@/domain/user/user.entity';

export class UserRepositoryMock implements UserRepositoryPort {
  findByUsername = jest.fn<
    Promise<Result<User, string | { username?: string; email?: string }>>,
    [string]
  >();
  findByEmail = jest.fn<
    Promise<Result<User, string | { username?: string; email?: string }>>,
    [string]
  >();
  save = jest.fn<
    Promise<Result<User, string | { username?: string; email?: string }>>,
    [User]
  >();
  findById = jest.fn<
    Promise<Result<User, string | { username?: string; email?: string }>>,
    [string]
  >();
}
