import { GithubRepositoryService } from './github-repository.service';

let instance: GithubRepositoryService | null = null;

/**
 * Sets the GithubRepositoryService instance.
 * @param svc
 */
export function setGithubRepositoryService(svc: GithubRepositoryService) {
  instance = svc;
}

/**
 * Gets the GithubRepositoryService instance.
 * @returns {GithubRepositoryService}
 * @throws {Error} if the GithubRepositoryService is not initialized
 */
export function getGithubRepositoryService(): GithubRepositoryService {
  if (!instance) {
    throw new Error('GithubRepositoryService is not initialized');
  }
  return instance;
}
