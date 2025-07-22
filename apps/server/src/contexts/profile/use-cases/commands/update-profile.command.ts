import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProfileRepositoryPort } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Profile } from '@/contexts/profile/domain/profile.entity';
import { Result } from '@/libs/result';
import { PROFILE_REPOSITORY_PORT } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Inject } from '@nestjs/common';
import { SocialLink, SocialLinkType } from '@/contexts/profile/domain/social-link.vo';
import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';

export class UpdateProfileCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly props: {
      name?: string;
      avatarUrl?: string;
      bio?: string;
      location?: string;
      company?: string;
      socialLinks?: { type: string; url: string }[];
      experiences?: {
        company: string;
        position: string;
        startDate: string;
        endDate?: string;
      }[];
    },
  ) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    @Inject(PROFILE_REPOSITORY_PORT)
    private readonly profileRepository: ProfileRepositoryPort,
  ) {}

  async execute(
    command: UpdateProfileCommand,
  ): Promise<Result<Profile, string>> {
    const { userId, props } = command;

    // Vérifier que le profil existe
    const existingProfileResult = await this.profileRepository.findById(userId);
    if (!existingProfileResult.success) {
      return Result.fail('Profile not found');
    }

    const existingProfile = existingProfileResult.value;
    const existingData = existingProfile.toPrimitive();

    // Préparer les données mises à jour
    const updatedData = {
      userId: existingData.userId,
      name: props.name ?? existingData.name,
      login: existingData.login, // Le login ne peut pas être modifié
      avatarUrl: props.avatarUrl ?? existingData.avatarUrl,
      bio: props.bio ?? existingData.bio,
      location: props.location ?? existingData.location,
      company: props.company ?? existingData.company,
      socialLinks: props.socialLinks ?? existingData.socialLinks.map(sl => ({ type: sl.type, url: sl.url })),
      experiences: props.experiences ?? existingData.experiences.map(exp => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate instanceof Date ? exp.startDate.toISOString() : exp.startDate,
        endDate: exp.endDate ? (exp.endDate instanceof Date ? exp.endDate.toISOString() : exp.endDate) : undefined,
      })),
    };

    // Valider et créer le profil mis à jour
    const updatedProfileResult = Profile.create(updatedData);
    if (!updatedProfileResult.success) {
      return Result.fail(updatedProfileResult.error);
    }

    const updatedProfile = updatedProfileResult.value;

    // Sauvegarder les modifications
    const saveResult = await this.profileRepository.update(
      userId,
      updatedProfile.toPrimitive(),
    );

    if (!saveResult.success) {
      return Result.fail('Unable to update profile');
    }

    return Result.ok(saveResult.value);
  }
}