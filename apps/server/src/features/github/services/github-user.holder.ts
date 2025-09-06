import { GithubUserService } from './github-user.service';

let instance: GithubUserService | null = null;

/**
 * Sets the GithubUserService instance.
 * @param svc
 */
export function setGithubUserService(svc: GithubUserService) {
  instance = svc;
}

/**
 * Gets the GithubUserService instance.
 * @returns {GithubUserService}
 * @throws {Error} if the GithubUserService is not initialized
 */
export function getGithubUserService(): GithubUserService {
  if (!instance) {
    throw new Error('GithubUserService is not initialized');
  }
  return instance;
}
