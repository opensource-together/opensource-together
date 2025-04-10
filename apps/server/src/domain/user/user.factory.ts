import { User } from '@domain/user/user.entity';
import { Username } from '@domain/user/username.vo';
import { Email } from '@domain/user/email.vo';
import { Result } from '@shared/result';

export class UserFactory {
  static create(id: string, username: string, email: string): Result<User> {
    const usernameVo = Username.create(username);
    const emailVo = Email.create(email);
    if (!usernameVo.success) return Result.fail(usernameVo.error);
    if (!emailVo.success) return Result.fail(emailVo.error);
    return Result.ok(
      new User({
        id,
        username: usernameVo.value,
        email: emailVo.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }
}
