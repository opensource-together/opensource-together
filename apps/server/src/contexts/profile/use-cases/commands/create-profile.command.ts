import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProfileRepositoryPort } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Profile } from '@/contexts/profile/domain/profile.entity';
import { Result } from '@/shared/result';
import { PROFILE_REPOSITORY_PORT } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Inject } from '@nestjs/common';
import {
  SocialLink,
  SocialLinkType,
} from '@/contexts/profile/domain/social-link.vo';
import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';

export class CreateProfileCommand implements ICommand {
  public readonly userId: string;
  public readonly name: string;
  public readonly avatarUrl: string;
  public readonly bio: string;
  public readonly location: string;
  public readonly company: string;
  public readonly socialLinks: { type: string; url: string }[];
  public readonly experiences: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
  }[];

  constructor(props: {
    userId: string;
    name: string;
    avatarUrl: string;
    bio: string;
    location: string;
    company: string;
    socialLinks: { type: string; url: string }[];
    experiences: {
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
    }[];
  }) {
    this.userId = props.userId;
    this.name = props.name;
    this.avatarUrl = props.avatarUrl;
    this.bio = props.bio;
    this.location = props.location;
    this.company = props.company;
    this.socialLinks = props.socialLinks || [];
    this.experiences = props.experiences || [];
  }
}

@CommandHandler(CreateProfileCommand)
export class CreateProfileCommandHandler
  implements ICommandHandler<CreateProfileCommand>
{
  constructor(
    @Inject(PROFILE_REPOSITORY_PORT)
    private readonly profileRepository: ProfileRepositoryPort,
  ) {}

  async execute(
    command: CreateProfileCommand,
  ): Promise<Result<Profile, string>> {
    if (!command.userId || !command.name) {
      return Result.fail('userId and name are required to create a profile.');
    }

    const socialLinkVOs: SocialLink[] = [];
    for (const linkData of command.socialLinks) {
      if (!linkData.url) continue;

      const socialLinkResult = SocialLink.create({
        type: linkData.type as SocialLinkType,
        url: linkData.url,
      });
      if (!socialLinkResult.success) {
        return Result.fail(socialLinkResult.error);
      }
      socialLinkVOs.push(socialLinkResult.value);
    }

    const experienceVOs: ProfileExperience[] = [];
    for (const expData of command.experiences) {
      const experienceResult = ProfileExperience.create(expData);
      if (!experienceResult.success) {
        return Result.fail(experienceResult.error);
      }
      experienceVOs.push(experienceResult.value);
    }

    const savedProfileResult = await this.profileRepository.create({
      userId: command.userId,
      name: command.name,
      avatarUrl: command.avatarUrl,
      bio: command.bio,
      location: command.location,
      company: command.company,
      socialLinks: socialLinkVOs,
      experiences: experienceVOs,
    });

    if (!savedProfileResult.success) {
      return Result.fail('Erreur technique lors de la création du profil.');
    }

    return Result.ok(savedProfileResult.value);
  }
}
