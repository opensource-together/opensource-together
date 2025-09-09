/**
 * Profile
 * @description Represents a user's profile in the system.
 * @property {string} id - Unique identifier for the profile.
 * @property {string} userId - Unique identifier for the user associated with the profile.
 * @property {string} bio - biography of the user.
 * @property {string} location - Location of the user.
 * @property {string} company - Company where the user works.
 * @property {string} jobTitle - Job title of the user.
 * @property {Date} createdAt - Timestamp when the profile was created.
 * @property {Date} updatedAt - Timestamp when the profile was last updated.
 */
export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  jobTitle: string | null;
  createdAt: Date;
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
