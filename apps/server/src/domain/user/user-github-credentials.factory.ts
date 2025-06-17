import { UserGitHubCredentials } from './user-github-credentials.entity';

export class UserGitHubCredentialsFactory {
  /**
   * For creating a new entity before saving to DB.
   * Dates and ID are handled by the database.
   */
  public static create(props: {
    userId: string;
    githubUserId: string;
    githubAccessToken: string;
  }): UserGitHubCredentials {
    return new UserGitHubCredentials({
      userId: props.userId,
      githubUserId: props.githubUserId,
      githubAccessToken: props.githubAccessToken,
    });
  }

  /**
   * For reconstituting an entity from the database.
   */
  public static reconstitute(props: {
    userId: string;
    githubUserId: string;
    githubAccessToken: string;
  }): UserGitHubCredentials {
    return new UserGitHubCredentials(props);
  }
}
