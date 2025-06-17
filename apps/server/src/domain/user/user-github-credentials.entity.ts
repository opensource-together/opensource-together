export class UserGitHubCredentials {
  private readonly userId: string;
  private readonly githubUserId: string;
  private githubAccessToken: string;

  constructor({
    userId,
    githubUserId,
    githubAccessToken,
  }: {
    userId: string;
    githubUserId: string;
    githubAccessToken: string;
  }) {
    this.userId = userId;
    this.githubUserId = githubUserId;
    this.githubAccessToken = githubAccessToken;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getGithubUserId(): string {
    return this.githubUserId;
  }

  public getGithubAccessToken(): string {
    return this.githubAccessToken;
  }

  public updateGithubAccessToken(token: string) {
    this.githubAccessToken = token;
  }
}
