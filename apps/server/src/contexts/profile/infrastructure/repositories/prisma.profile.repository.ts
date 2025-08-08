// import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';
// import { Profile } from '@/contexts/profile/domain/profile.entity';
// import { ProfileRepositoryPort } from '@/contexts/profile/use-cases/ports/profile.repository.port';
// import { Result } from '@/libs/result';
// import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaProfileMapper } from './prisma.profile.mapper';

// @Injectable()
// export class PrismaProfileRepository implements ProfileRepositoryPort {
//   private readonly Logger = new Logger(PrismaProfileRepository.name);
//   constructor(private readonly prisma: PrismaService) {}

//   async create(profile: {
//     userId: string;
//     name: string;
//     login: string;
//     avatarUrl: string;
//     bio: string;
//     location: string;
//     company: string;
//     socialLinks?: {
//       github?: string;
//       website?: string;
//       twitter?: string;
//       linkedin?: string;
//       discord?: string;
//     };
//     experiences: ProfileExperience[];
//   }): Promise<Result<Profile, string>> {
//     const { profileData, socialLinksData } =
//       PrismaProfileMapper.toRepo(profile);

//     try {
//       const savedRawProfile = await this.prisma.$transaction(async (tx) => {
//         await tx.profile.upsert({
//           where: { userId: profileData.userId },
//           update: profileData,
//           create: profileData,
//         });

//         await tx.userSocialLink.deleteMany({
//           where: { userId: profileData.userId },
//         });

//         if (socialLinksData.length > 0) {
//           await tx.userSocialLink.createMany({
//             data: socialLinksData.map((link) => ({
//               ...link,
//               userId: profileData.userId,
//             })),
//           });
//         }

//         return tx.profile.findUnique({
//           where: { userId: profileData.userId },
//           include: { socialLinks: true, techStacks: true },
//         });
//       });

//       if (!savedRawProfile) {
//         return Result.fail(
//           "Erreur technique : Le profil n'a pas pu être retrouvé après sa sauvegarde.",
//         );
//       }

//       const domainProfile = PrismaProfileMapper.toDomain(savedRawProfile);
//       return Result.ok(domainProfile);
//     } catch (error) {
//       this.Logger.error(error);
//       return Result.fail('Erreur technique lors de la sauvegarde du profil.');
//     }
//   }

//   async findById(id: string): Promise<Result<Profile, string>> {
//     try {
//       const rawProfile = await this.prisma.profile.findUnique({
//         where: { userId: id },
//         include: { socialLinks: true, techStacks: true },
//       });

//       if (!rawProfile) {
//         return Result.fail('Profil non trouvé.');
//       }

//       const domainProfile = PrismaProfileMapper.toDomain(rawProfile);
//       return Result.ok(domainProfile);
//     } catch (error) {
//       this.Logger.error(error);
//       return Result.fail('Erreur technique lors de la recherche du profil.');
//     }
//   }

//   async update(
//     userId: string,
//     profile: Profile,
//   ): Promise<Result<Profile, string>> {
//     const profileData = profile.toPrimitive();
//     const { profileData: repoData, socialLinksData } =
//       PrismaProfileMapper.toRepo(profileData);

//     try {
//       const updatedRawProfile = await this.prisma.$transaction(async (tx) => {
//         // Mettre à jour le profil
//         await tx.profile.update({
//           where: { userId },
//           data: {
//             name: repoData.name,
//             avatarUrl: repoData.avatarUrl,
//             bio: repoData.bio,
//             location: repoData.location,
//             company: repoData.company,
//             updatedAt: new Date(),
//           },
//         });

//         // Supprimer les anciens liens sociaux
//         await tx.userSocialLink.deleteMany({
//           where: { userId },
//         });

//         // Créer les nouveaux liens sociaux
//         if (socialLinksData.length > 0) {
//           await tx.userSocialLink.createMany({
//             data: socialLinksData.map((link) => ({
//               ...link,
//               userId,
//             })),
//           });
//         }

//         // Mettre à jour les relations techStacks
//         // D'abord, supprimer toutes les relations existantes
//         await tx.techStack.updateMany({
//           where: { profileId: userId },
//           data: { profileId: null },
//         });

//         // Puis connecter les nouvelles techStacks
//         if (profileData.techStacks.length > 0) {
//           const techStackIds = profileData.techStacks.map((ts) => ts.id);
//           await tx.techStack.updateMany({
//             where: { id: { in: techStackIds } },
//             data: { profileId: userId },
//           });
//         }

//         // Retourner le profil mis à jour
//         return tx.profile.findUnique({
//           where: { userId },
//           include: { socialLinks: true, techStacks: true },
//         });
//       });

//       if (!updatedRawProfile) {
//         return Result.fail(
//           "Erreur technique : Le profil n'a pas pu être retrouvé après sa mise à jour.",
//         );
//       }

//       const domainProfile = PrismaProfileMapper.toDomain(updatedRawProfile);
//       return Result.ok(domainProfile);
//     } catch (error) {
//       this.Logger.error('Error updating profile:', error);
//       return Result.fail('Erreur technique lors de la mise à jour du profil.');
//     }
//   }

//   async delete(userId: string): Promise<Result<boolean, string>> {
//     try {
//       await this.prisma.$transaction(async (tx) => {
//         // Supprimer les liens sociaux d'abord (contrainte de clé étrangère)
//         await tx.userSocialLink.deleteMany({
//           where: { userId },
//         });

//         // Supprimer le profil
//         await tx.profile.delete({
//           where: { userId },
//         });
//       });

//       return Result.ok(true);
//     } catch (error) {
//       this.Logger.error('Error deleting profile:', error);
//       return Result.fail('Erreur technique lors de la suppression du profil.');
//     }
//   }
// }
