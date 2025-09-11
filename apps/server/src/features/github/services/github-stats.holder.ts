import { GithubStatsService } from './github-stats.service';

let instance: GithubStatsService | null = null;

/**
 * Sets the GithubStatsService instance.
 * @param svc
 */
export function setGithubStatsService(svc: GithubStatsService) {
  instance = svc;
}

/**
 * Gets the GithubStatsService instance.
 * @returns {GithubStatsService}
 * @throws {Error} if the GithubStatsService is not initialized
 */
export function getGithubStatsService(): GithubStatsService {
  if (!instance) {
    throw new Error('GithubStatsService is not initialized');
  }
  return instance;
}
