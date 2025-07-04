import { Result } from '@/libs/result';

export class Email {
  private constructor(private readonly email: string) {}

  static create(email: string): Result<Email> {
    if (
      email.match(
        // /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ) == null
    ) {
      return Result.fail('Email invalide');
    }
    return Result.ok(new Email(email));
  }

  public getEmail(): string {
    return this.email;
  }

  public static fromPersistence(email: string): Email {
    return new Email(email);
  }
}
