// apps/server/src/domain/user/user.entity.ts

import { Username } from '@domain/user/username.vo';
import { Email } from '@domain/user/email.vo';
import { Result } from '@/shared/result';

export class User {
  private readonly id: string;
  private username: Username;
  private email: Email;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  // Le constructeur est le SEUL moyen de créer un User.
  // Il garantit qu'un User ne peut pas exister dans un état invalide.
  private constructor(props: {
    id: string;
    username: Username;
    email: Email;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public static reconstitute(props: {
    id: string;
    username: Username;
    email: Email;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(props);
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
  public getState() {
    return {
      id: this.id,
      username: this.username.getUsername(),
      email: this.email.getEmail(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
