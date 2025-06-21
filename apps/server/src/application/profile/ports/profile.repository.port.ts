import { ProfileExperience } from '@/domain/profile/profile-experience.vo';
import { Profile } from '@/domain/profile/profile.entity';
import { SocialLink } from '@/domain/profile/social-link.vo';
import { Result } from '@/shared/result';

export const PROFILE_REPOSITORY_PORT = Symbol('ProfileRepository');

export interface ProfileRepositoryPort {
  create(profile: {
    userId: string;
    name: string;
    avatarUrl: string;
    bio: string;
    location: string;
    company: string;
    socialLinks: SocialLink[];
    experiences: ProfileExperience[];
  }): Promise<Result<Profile, string>>;
  findById(id: string): Promise<Result<Profile, string>>;
}
