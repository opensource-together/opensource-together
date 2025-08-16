import { Profile } from '../domain/profile.entity';
import { Result } from '@/libs/result';

export const PROFILE_REPOSITORY_PORT = Symbol('ProfileRepository');

export interface ProfileRepositoryPort {
  findById(id: string): Promise<Result<Profile, string>>;
  update(userId: string, profile: Profile): Promise<Result<Profile, string>>;
  delete(userId: string): Promise<Result<boolean, string>>;
}
