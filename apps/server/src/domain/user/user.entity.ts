import { Username } from '@domain/user/username.vo';
import { Email } from '@domain/user/email.vo';
export class User {
  private readonly id: string;
  private username: Username;
  private email: Email;
  private avatarUrl: string;
  private bio: string;
  private githubUrl: string;
  private githubUserId: string;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;
  constructor({
    id,
    username,
    email,
    avatarUrl,
    bio,
    githubUrl,
    createdAt,
    updatedAt,
  }: {
    id: string;
    username: Username;
    email: Email;
    avatarUrl: string;
    bio: string;
    githubUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.bio = bio;
    this.githubUrl = githubUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getId() {
    return this.id;
  }

  public getUsername() {
    return this.username.getUsername();
  }

  public getEmail() {
    return this.email.getEmail();
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }

  public getAvatarUrl() {
    return this.avatarUrl;
  }

  public getBio() {
    return this.bio;
  }

  public getGithubUrl() {
    return this.githubUrl;
  }
}
