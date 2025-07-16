import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProfileRepositoryPort } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Profile } from '@/contexts/profile/domain/profile.entity';
import { Result } from '@/libs/result';
import { PROFILE_REPOSITORY_PORT } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Inject } from '@nestjs/common';

export class CreateProfileCommand implements ICommand {
  public readonly userId: string;
  public readonly name: string;
  public readonly login: string;
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
    login: string;
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
    this.login = props.login;
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
    const profileResult: Result<Profile, string> = Profile.create(command);

    if (!profileResult.success) return Result.fail(profileResult.error);

    const profile: Profile = profileResult.value;

    const savedProfileResult = await this.profileRepository.create(
      profile.toPrimitive(),
    );
    console.log({ savedProfileResult });

    if (!savedProfileResult.success)
      return Result.fail('Erreur technique lors de la création du profil.');

    return Result.ok(savedProfileResult.value);
  }
}
