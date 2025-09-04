import { UserService } from './user.service';

let instance: UserService | null = null;

/**
 * Sets the UserService instance.
 * @param svc
 */
export function setUserService(svc: UserService) {
  instance = svc;
}

/**
 * Gets the UserService instance.
 * @returns {UserService}
 * @throws {Error} if the ProfileService is not initialized
 */
export function getUserService(): UserService {
  if (!instance) {
    throw new Error('UserService is not initialized');
  }
  return instance;
}
