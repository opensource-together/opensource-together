import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { User } from '@/contexts/user/domain/user.entity';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../ports/user.repository.port';
import { Result } from '@/libs/result';
// import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly props: {
      readonly id: string;
      readonly username: string;
      readonly email: string;
      readonly name: string;
      readonly login: string;
      readonly avatarUrl?: string;
      readonly location?: string;
      readonly company?: string;
      readonly bio?: string;
      readonly socialLinks?: {
        github?: string;
        website?: string;
        twitter?: string;
        linkedin?: string;
        discord?: string;
      };
      readonly experiences?: {
        company: string;
        position: string;
        startDate: string;
        endDate?: string;
      }[];
      readonly projects?: {
        name: string;
        description: string;
        url: string;
      }[];
    },
  ) {}
}

/**
 * Use case responsible for creating new users in the system.
 * Handles validation of unique username/email and user creation through the repository.
 */
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  /**
   * Creates a new user in the system.
   * @param command - The command containing user creation details
   * @returns A Result object containing either the created User entity or error details
   *          Error can be either validation errors for username/email or a general error message
   * @throws Never - All errors are handled and returned in the Result object
   */
  async execute(command: CreateUserCommand): Promise<Result<User, string>> {
    const {
      id,
      username,
      email,
      // name,
      company,
      bio,
      socialLinks,
      experiences,
      projects,
      login,
      avatarUrl,
      location,
    } = command.props;

    const [userExistsByUsername, userExistsByEmail] = await Promise.all([
      this.userRepo.findByUsername(username),
      this.userRepo.findByEmail(email),
    ]);

    console.log('userExistsByUsername', userExistsByUsername);
    console.log('userExistsByEmail', userExistsByEmail);

    if (userExistsByUsername.success || userExistsByEmail.success) {
      return Result.fail('Identifiants incorrects.');
    }

    const validUser = User.create({
      id,
      username,
      email,
      // name,
      login,
      avatarUrl,
      location,
      company,
      bio,
      socialLinks,
      experiences,
      projects,
    });
    // console.log('validUser', validUser);

    if (!validUser.success) {
      return Result.fail(
        typeof validUser.error === 'string'
          ? validUser.error
          : 'Erreur de validation utilisateur',
      );
    }

    console.log('validUser', validUser.value);

    const savedUser: Result<User, string> = await this.userRepo.create(
      validUser.value,
    );

    console.log('savedUser', savedUser);
    if (!savedUser.success) {
      return Result.fail(
        "Erreur technique lors de la création de l'utilisateur.",
      );
    }

    return Result.ok(savedUser.value);
  }
}
