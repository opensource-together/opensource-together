import { Profile, UpsertProfileData } from '@/features/profile/domain/profile';

import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { SocialLinkType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProfileRepository } from './profile.repository.interface';

const SOCIAL_LINK_MAP: Record<string, SocialLinkType> = {
  twitter: 'TWITTER',
  github: 'GITHUB',
  linkedin: 'LINKEDIN',
  discord: 'DISCORD',
  website: 'WEBSITE',
};

function mapSocialType(name: string): SocialLinkType | null {
  return SOCIAL_LINK_MAP[name.toLowerCase()] ?? null;
}
@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async upsert(data: UpsertProfileData): Promise<Result<Profile, string>> {
    try {
      const result = await this.prismaService.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: data.userId },
          data: {
            name: data.username,
            ...(data.avatarUrl && { image: data.avatarUrl }),
          },
        });

        const completeProfile = await tx.profile.upsert({
          where: { userId: data.userId },
          create: {
            userId: data.userId,
            bio: data.bio,
            jobTitle: data.jobTitle,
            ...(data.techStacks && {
              techStacks: { connect: data.techStacks.map((id) => ({ id })) },
            }),
          },
          update: {
            bio: data.bio,
            jobTitle: data.jobTitle,
            ...(data.techStacks !== undefined && {
              techStacks: { set: data.techStacks.map((id) => ({ id })) },
            }),
          },
          select: {
            id: true,
            userId: true,
            bio: true,
            jobTitle: true,
            createdAt: true,
            updatedAt: true,
            techStacks: {
              select: { id: true, name: true, iconUrl: true, type: true },
            },
            user: {
              select: {
                name: true,
                image: true,
                accounts: {
                  select: { providerId: true },
                  take: 1,
                  orderBy: { createdAt: 'desc' },
                },
                UserSocialLink: { select: { type: true, url: true } },
                Project: { select: { id: true } },
              },
            },
          },
        });

        if (data.socialLinks) {
          await tx.userSocialLink.deleteMany({
            where: { userId: data.userId },
          });

          const toCreate = Object.entries(data.socialLinks)
            .map(([k, url]) => ({
              type: mapSocialType(k),
              url: typeof url === 'string' ? url.trim() : '',
            }))
            .filter(
              (x): x is { type: SocialLinkType; url: string } =>
                !!x.type && !!x.url,
            )
            .map(({ type, url }) => ({ userId: data.userId, type, url }));

          if (toCreate.length) {
            await tx.userSocialLink.createMany({ data: toCreate });
          }
        }

        return {
          id: completeProfile.userId,
          username: completeProfile.user.name || '',
          avatarUrl: completeProfile.user.image,
          provider: completeProfile.user.accounts[0]?.providerId || '',
          bio: completeProfile.bio,
          jobTitle: completeProfile.jobTitle,
          socialLinks: (completeProfile.user.UserSocialLink || []).reduce(
            (acc, link) => {
              const type = link.type.toLowerCase();
              if (
                type === 'github' ||
                type === 'twitter' ||
                type === 'linkedin' ||
                type === 'discord' ||
                type === 'website'
              ) {
                acc[type] = link.url;
              }
              return acc;
            },
            {} as {
              github?: string;
              twitter?: string;
              linkedin?: string;
              discord?: string;
              website?: string;
            },
          ),
          techStacks: (completeProfile.techStacks || []).map((ts) => ({
            id: ts.id,
            name: ts.name,
            iconUrl: ts.iconUrl,
            type: ts.type,
          })),
          projects: [],
          joinedAt: completeProfile.createdAt,
          updatedAt: completeProfile.updatedAt,
        };
      });

      return Result.ok(result);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return Result.fail('Failed to upsert profile: ' + error.message);
      }
      return Result.fail(
        'An unexpected error occurred while upserting profile',
      );
    }
  }

  async getProfileByUserId(userId: string): Promise<Result<Profile, string>> {
    try {
      const profile = await this.prismaService.profile.findUnique({
        where: { userId },
        select: {
          id: true,
          userId: true,
          bio: true,
          jobTitle: true,
          createdAt: true,
          updatedAt: true,
          techStacks: {
            select: { id: true, name: true, iconUrl: true, type: true },
          },
          user: {
            select: {
              name: true,
              image: true,
              accounts: {
                select: { providerId: true },
                take: 1,
                orderBy: { createdAt: 'desc' },
              },
              UserSocialLink: { select: { type: true, url: true } },
              Project: { select: { id: true } },
            },
          },
        },
      });

      if (!profile) {
        return Result.fail('Profile not found');
      }

      return Result.ok({
        id: profile.userId,
        username: profile.user.name || '',
        avatarUrl: profile.user.image,
        provider: profile.user.accounts[0]?.providerId || '',
        bio: profile.bio,
        jobTitle: profile.jobTitle,
        socialLinks: (profile.user.UserSocialLink || []).reduce(
          (acc, link) => {
            const type = link.type.toLowerCase();
            if (
              type === 'github' ||
              type === 'twitter' ||
              type === 'linkedin' ||
              type === 'discord' ||
              type === 'website'
            ) {
              acc[type] = link.url;
            }
            return acc;
          },
          {} as {
            github?: string;
            twitter?: string;
            linkedin?: string;
            discord?: string;
            website?: string;
          },
        ),
        techStacks:
          profile.techStacks?.map((ts) => ({
            id: ts.id,
            name: ts.name,
            iconUrl: ts.iconUrl,
            type: ts.type,
          })) || [],
        projects: [],
        joinedAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return Result.fail('Failed to retrieve profile: ' + error.message);
      }
      return Result.fail(
        'An unexpected error occurred while retrieving profile',
      );
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await this.prismaService.profile.delete({
        where: { userId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error('Failed to delete profile: ' + error.message);
      }
      throw new Error('An unexpected error occurred while deleting profile');
    }
  }
}
