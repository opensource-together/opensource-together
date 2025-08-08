import {
  TECHSTACK_REPOSITORY_PORT,
  TechStackRepositoryPort,
} from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { User } from '@/contexts/user/domain/user.entity';
import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../ports/user.repository.port';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly props: {
      username?: string;
      avatarUrl?: string;
      bio?: string;
      location?: string;
      company?: string;
      jobTitle?: string;
      socialLinks?: {
        github?: string;
        website?: string;
        twitter?: string;
        linkedin?: string;
        discord?: string;
      };
      techStacks?: string[];
      experiences?: {
        company: string;
        position: string;
        startDate: string;
        endDate?: string;
      }[];
      projects?: { name: string; description: string; url: string }[];
    },
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepository: TechStackRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<Result<User, string>> {
    const { userId, props } = command;

    // Vérifier que l'utilisateur existe
    const existingUserResult = await this.userRepository.findById(userId);
    if (!existingUserResult.success) {
      return Result.fail('User not found');
    }

    const existingUser = existingUserResult.value;

    // Récupérer les techStacks complets si des IDs sont fournis
    if (props.techStacks && props.techStacks.length > 0) {
      const techStacksResult = await this.techStackRepository.findByIds(
        props.techStacks,
      );
      if (!techStacksResult.success) {
        return Result.fail('Some tech stacks not found');
      }

      // Mettre à jour les tech stacks
      const updateTechStacksResult = await this.userRepository.updateTechStacks(
        userId,
        props.techStacks,
      );
      if (!updateTechStacksResult.success) {
        return Result.fail('Failed to update tech stacks');
      }
    }

    // Mettre à jour les autres propriétés du profil
    const updateResult = existingUser.updateProfile({
      username: props.username,
      avatarUrl: props.avatarUrl,
      bio: props.bio,
      location: props.location,
      company: props.company,
      jobTitle: props.jobTitle,
      socialLinks: props.socialLinks,
    });

    if (!updateResult.success) {
      return Result.fail(updateResult.error);
    }

    // Sauvegarder les modifications
    const saveResult = await this.userRepository.update(existingUser);
    if (!saveResult.success) {
      return Result.fail('Unable to update user');
    }

    return Result.ok(saveResult.value);
  }
}
