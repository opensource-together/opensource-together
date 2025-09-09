import { Profile } from '@/features/profile/domain/profile';
import { Result } from '@/libs/result';

export interface UpsertProfileData {
  userId: string;
  bio?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
}

export interface CompleteProfile {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  socialLinks?: socialLinks[];
  techStack?: string[];
  experience?: string[];
  projects?: string[];
  joinedAt: Date;
  updatedAt: Date;
}

interface socialLinks {
  name: string;
  url: string;
}

export interface ProfileRepository {
  upsert(data: UpsertProfileData): Promise<Result<Profile, string>>;
  getProfileByUserId(userId: string): Promise<Result<CompleteProfile, string>>;
}
