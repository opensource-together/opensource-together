import { User } from '@domain/user/user.entity';
import { Username } from '@domain/user/username.vo';
import { Email } from '@domain/user/email.vo';
import { Result } from '@shared/result';

export class UserFactory {
  static create({
    id,
    username,
    email,
    avatarUrl,
    bio,
    githubUrl,
  }: {
    id: string;
    username: string;
    email: string;
    avatarUrl: string;
    bio: string;
    githubUrl: string;
  }): Result<User, { username?: string; email?: string } | string> {
    const usernameVo = Username.create(username);
    const emailVo = Email.create(email);
    const error: { username?: string; email?: string } = {};
    if (!emailVo.success) error.email = emailVo.error;
    if (!usernameVo.success) error.username = usernameVo.error;
    if (!usernameVo.success || !emailVo.success) return Result.fail(error);

    return Result.ok(
      new User({
        id,
        username: usernameVo.value,
        email: emailVo.value,
        avatarUrl,
        bio,
        githubUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }
}
