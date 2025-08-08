// import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
// import { ProfileRepositoryPort } from '@/contexts/profile/use-cases/ports/profile.repository.port';
// import { Profile } from '@/contexts/profile/domain/profile.entity';
// import { Result } from '@/libs/result';
// import { PROFILE_REPOSITORY_PORT } from '@/contexts/profile/use-cases/ports/profile.repository.port';
// import { Inject, Logger } from '@nestjs/common';

// export class CreateProfileCommand implements ICommand {
//   public readonly userId: string;
//   public readonly name: string;
//   public readonly login: string;
//   public readonly avatarUrl: string;
//   public readonly bio: string;
//   public readonly location: string;
//   public readonly provider: string;
//   public readonly company: string;
//   public readonly socialLinks: { type: string; url: string }[];
//   public readonly experiences: {
//     company: string;
//     position: string;
//     startDate: string;
//     endDate?: string;
//   }[];

//   constructor(props: {
//     userId: string;
//     name: string;
//     login: string;
//     avatarUrl: string;
//     bio: string;
//     location: string;
//     provider: string;
//     company: string;
//     socialLinks: { type: string; url: string }[];
//     experiences: {
//       company: string;
//       position: string;
//       startDate: string;
//       endDate?: string;
//     }[];
//   }) {
//     this.userId = props.userId;
//     this.name = props.name;
//     this.login = props.login;
//     this.avatarUrl = props.avatarUrl;
//     this.bio = props.bio;
//     this.location = props.location;
//     this.company = props.company;
//     this.socialLinks = props.socialLinks || [];
//     this.experiences = props.experiences || [];
//   }
// }

// @CommandHandler(CreateProfileCommand)
// export class CreateProfileCommandHandler
//   implements ICommandHandler<CreateProfileCommand>
// {
//   private readonly Logger = new Logger(CreateProfileCommand.name);
//   constructor(
//     @Inject(PROFILE_REPOSITORY_PORT)
//     private readonly profileRepository: ProfileRepositoryPort,
//   ) {}

//   async execute(
//     command: CreateProfileCommand,
//   ): Promise<Result<Profile, string>> {
//     // Convertir les socialLinks du format tableau vers l'objet simple
//     const socialLinksObject: {
//       github?: string;
//       website?: string;
//       twitter?: string;
//       linkedin?: string;
//       discord?: string;
//     } = {};

//     command.socialLinks.forEach((link) => {
//       const linkType = link.type as keyof typeof socialLinksObject;
//       socialLinksObject[linkType] = link.url;
//     });

//     const profileData = {
//       userId: command.userId,
//       name: command.name,
//       login: command.login,
//       avatarUrl: command.avatarUrl,
//       bio: command.bio,
//       location: command.location,
//       company: command.company,
//       socialLinks: socialLinksObject,
//       experiences: command.experiences,
//     };

//     const profileResult: Result<Profile, string> = Profile.create(profileData);

//     if (!profileResult.success) return Result.fail(profileResult.error);

//     const profile: Profile = profileResult.value;

//     const savedProfileResult = await this.profileRepository.create(
//       profile.toPrimitive(),
//     );
//     this.Logger.log({ savedProfileResult });

//     if (!savedProfileResult.success)
//       return Result.fail('Erreur technique lors de la création du profil.');

//     return Result.ok(savedProfileResult.value);
//   }
// }
