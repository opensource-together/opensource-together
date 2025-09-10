import { Profile as DomainProfile } from '@/features/profile/domain/profile';
import {
  CompleteProfile,
  ProfileRepository,
  UpsertProfileData,
} from '@/features/profile/repositories/profile.repository.interface';
import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async upsert(
    data: UpsertProfileData,
  ): Promise<Result<DomainProfile, string>> {
    try {
      const profile = await this.prismaService.profile.upsert({
        where: { userId: data.userId },
        update: {
          bio: data.bio,
          location: data.location,
          company: data.company,
          jobTitle: data.jobTitle,
        },
        create: data,
      });

      return Result.ok({
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        location: profile.location,
        company: profile.company,
        jobTitle: profile.jobTitle,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return Result.fail('Failed to upsert profile: ' + error.message);
      }
      return Result.fail(
        'An unexpected error occurred while upserting profile',
      );
    }
  }

  async getProfileByUserId(
    userId: string,
  ): Promise<Result<CompleteProfile, string>> {
    try {
      const profile = await this.prismaService.profile.findUnique({
        where: { userId },
        include: {
          user: {
            include: {
              TechStack: true,
              UserSocialLink: true,
              Project: true,
              accounts: true,
            },
          },
        },
      });

      if (!profile) {
        return Result.fail('Profile not found');
      }

      return Result.ok({
        id: profile.id,
        name: profile.user.name,
        avatarUrl: profile.user.image,
        provider: profile.user.accounts[0]?.providerId ?? null,
        bio: profile.bio,
        location: profile.location,
        company: profile.company,
        socialLinks: [],
        techStack: [],
        experience: [],
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
