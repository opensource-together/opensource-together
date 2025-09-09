import { ProfileService } from '@/features/profile/services/profile.service';

let instance: ProfileService | null = null;

/**
 * Sets the ProfileService instance.
 * @param svc
 */
export function setProfileService(svc: ProfileService) {
  instance = svc;
}

/**
 * Gets the ProfileService instance.
 * @returns {ProfileService}
 * @throws {Error} if the ProfileService is not initialized
 */
export function getProfileService(): ProfileService {
  if (!instance) {
    throw new Error('ProfileService is not initialized');
  }
  return instance;
}
