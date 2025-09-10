export interface UpsertProfileData {
  userId: string;
  avatarUrl?: string;
  username: string;
  jobTitle?: string;
  bio?: string;
  techStacks?: string[];
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    discord?: string;
    website?: string;
  };
}

export interface Profile {
  id: string;
  username: string;
  avatarUrl: string | null;
  provider: string;
  jobTitle: string | null;
  bio: string | null;
  techStack?: string[];
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    discord?: string;
    website?: string;
  };
  projects?: string[];
  joinedAt: Date;
  updatedAt: Date;
}

interface ValidateProfileDto {
  id: string;
  userId: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateProject(
  profile: Partial<ValidateProfileDto>,
): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (!profile.id) errors.id = 'domain: Profile id is required';
  if (!profile.userId) errors.userId = 'domain: Profile userId is required';

  return Object.keys(errors).length > 0 ? errors : null;
}
