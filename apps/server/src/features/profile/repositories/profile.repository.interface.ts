import { Profile, UpsertProfileData } from '@/features/profile/domain/profile';
import { Result } from '@/libs/result';

export interface ProfileRepository {
  upsert(data: UpsertProfileData): Promise<Result<Profile, string>>;
  getProfileByUserId(userId: string): Promise<Result<Profile, string>>;
}
