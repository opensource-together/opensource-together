import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';
import { Profile } from '@/contexts/profile/domain/profile.entity';
import { SocialLink } from '@/contexts/profile/domain/social-link.vo';
import { Result } from '@/libs/result';

export const PROFILE_REPOSITORY_PORT = Symbol('ProfileRepository');

export interface ProfileRepositoryPort {
  create(profile: {
    userId: string;
    name: string;
    login: string;
    avatarUrl: string;
    bio: string;
    location: string;
    company: string;
    socialLinks: SocialLink[];
    experiences: ProfileExperience[];
  }): Promise<Result<Profile, string>>;
  findById(id: string): Promise<Result<Profile, string>>;
  update(
    userId: string,
    profile: Partial<Profile>,
  ): Promise<Result<Profile, string>>;
  delete(userId: string): Promise<Result<boolean, string>>;
}
