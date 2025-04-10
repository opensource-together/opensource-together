import { Username } from '@domain/user/username.vo';
import { Email } from '@domain/user/email.vo';
export class User {
  private readonly id: string;
  private username: Username;
  private email: Email;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;
  constructor({
    id,
    username,
    email,
    createdAt,
    updatedAt,
  }: {
    id: string;
    username: Username;
    email: Email;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
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
}
