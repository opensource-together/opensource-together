// apps/server/src/domain/user/user.entity.ts

import { Username } from '@/contexts/user/domain/username.vo';
import { Email } from '@/contexts/user/domain/email.vo';
import { Result } from '@/shared/result';

export class User {
  private readonly id: string;
  private username: Username;
  private email: Email;
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  // Le constructeur est le SEUL moyen de créer un User.
  // Il garantit qu'un User ne peut pas exister dans un état invalide.
  private constructor(props: {
    id: string;
    username: Username;
    email: Email;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public static create(props: {
    id: string;
    username: string;
    email: string;
  }): Result<
    User,
    { id?: string; username?: string; email?: string } | string
  > {
    const validateVO = this.validate(props);
    if (!validateVO.success) {
      return Result.fail(validateVO.error);
    }
    return Result.ok(
      new User({
        id: props.id,
        username: validateVO.value.username,
        email: validateVO.value.email,
      }),
    );
  }

  public static reconstitute(props: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): Result<User, { username?: string; email?: string } | string> {
    const validUser = this.validate(props);
    if (!validUser.success) {
      return Result.fail(validUser.error);
    }
    return Result.ok(
      new User({
        id: validUser.value.id,
        username: validUser.value.username,
        email: validUser.value.email,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      }),
    );
  }

  public static validate(props: {
    id: string;
    username: string;
    email: string;
  }): Result<
    { id: string; username: Username; email: Email },
    { id?: string; username?: string; email?: string } | string
  > {
    const error: { id?: string; username?: string; email?: string } = {};
    if (!props.id) {
      error.id = 'User id is required';
    }
    const usernameVo = Username.create(props.username);
    const emailVo = Email.create(props.email);
    if (!emailVo.success) error.email = emailVo.error;
    if (!usernameVo.success) error.username = usernameVo.error;
    if (!usernameVo.success || !emailVo.success) return Result.fail(error);
    return Result.ok({
      id: props.id,
      username: usernameVo.value,
      email: emailVo.value,
    });
  }
  // Pas de setters ! On expose un comportement métier.
  public changeUsername(newUsername: string) {
    // Logique de validation, règles métier...
    // Par exemple: if (this.isPremiumUser()) { ... }
    const usernameVo = Username.create(newUsername);
    if (!usernameVo.success) return Result.fail({ username: usernameVo.error });

    this.username = usernameVo.value;
  }

  public changeEmail(newEmail: string) {
    const emailVo = Email.create(newEmail);
    if (!emailVo.success) return Result.fail({ email: emailVo.error });

    this.email = emailVo.value;
  }

  // On n'expose pas les données brutes via des getters.
  // On expose une méthode pour extraire l'état à des fins de persistance ou de DTO.
  public toPrimitive() {
    return {
      id: this.id,
      username: this.username.getUsername(),
      email: this.email.getEmail(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
