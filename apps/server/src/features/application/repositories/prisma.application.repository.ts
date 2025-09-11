import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from './application.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { Result } from '@/libs/result';
import {
  ApplicationProjectRole,
  ApplicationStatus,
} from '../domain/application';

@Injectable()
export class PrismaApplicationRepository implements ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}
  async applyToProjectRole(application: {
    projectRoleId: string;
    userId: string;
    status: ApplicationStatus;
    motivationLetter: string;
    projectId: string;
    keyFeatureId: string;
  }): Promise<Result<ApplicationProjectRole, string>> {
    try {
      const createdApplication =
        await this.prisma.projectRoleApplication.create({
          data: {
            userId: application.userId,
            projectId: application.projectId,
            projectRoleId: application.projectRoleId,
            status: 'PENDING',
            keyFeatureId: application.keyFeatureId,
            motivationLetter: application.motivationLetter,
          },
        });

      const foundApplication =
        await this.prisma.projectRoleApplication.findUnique({
          where: { id: createdApplication.id },
          include: {
            user: true,
            projectRole: true,
            project: true,
            keyFeature: {
              select: {
                feature: true,
              },
            },
          },
        });
      if (!foundApplication) {
        return Result.fail('APPLICATION_NOT_FOUND');
      }
      return Result.ok({
        ...foundApplication,
        decidedBy: undefined,
        decidedAt: undefined,
        appliedAt: createdApplication.createdAt.toISOString(),
        keyFeatures: [foundApplication.keyFeature.feature],
      });
    } catch (error) {
      console.log('error', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
  async existsStatusApplication(
    userId: string,
    projectRoleId: string,
  ): Promise<Result<ApplicationStatus, string>> {
    try {
      const application = await this.prisma.projectRoleApplication.findFirst({
        where: {
          userId,
          projectRoleId,
          status: { in: ['PENDING', 'REJECTED', 'ACCEPTED', 'CANCELLED'] },
        },
      });
      if (!application) {
        return Result.fail('APPLICATION_NOT_FOUND');
      }
      return Result.ok(application.status);
    } catch (error) {
      console.error(error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async findById(id: string): Promise<Result<ApplicationProjectRole, string>> {
    try {
      const application = await this.prisma.projectRoleApplication.findUnique({
        where: { id },
        include: {
          user: true,
          projectRole: true,
          project: true,
          keyFeature: {
            select: {
              feature: true,
            },
          },
        },
      });
      if (!application) {
        return Result.fail('APPLICATION_NOT_FOUND');
      }
      const { keyFeature, ...applicationWithoutKeyFeature } = application;
      return Result.ok({
        ...applicationWithoutKeyFeature,
        decidedBy: application.decidedBy || undefined,
        decidedAt: application.decidedAt?.toISOString(),
        appliedAt: application.createdAt.toISOString(),
        keyFeatures: [keyFeature.feature],
      });
    } catch (error) {
      console.error(error);
      return Result.fail('DATABASE_ERROR');
    }
  }
  async cancelApplication(props: {
    applicationId: string;
    userId: string;
  }): Promise<Result<void, string>> {
    try {
      await this.prisma.projectRoleApplication.update({
        where: { id: props.applicationId },
        data: { status: 'CANCELLED' },
      });
      return Result.ok(undefined);
    } catch (error) {
      console.error(error);
      return Result.fail('DATABASE_ERROR');
    }
  }
  async acceptApplication(props: {
    applicationId: string;
    userId: string;
  }): Promise<Result<void, string>> {
    try {
      await this.prisma.projectRoleApplication.update({
        where: { id: props.applicationId },
        data: { status: 'ACCEPTED' },
      });
      return Result.ok(undefined);
    } catch (error) {
      console.error(error);
      return Result.fail('DATABASE_ERROR');
    }
  }
  async rejectApplication(props: {
    applicationId: string;
    userId: string;
    rejectionReason?: string;
  }): Promise<Result<void, string>> {
    try {
      await this.prisma.projectRoleApplication.update({
        where: { id: props.applicationId },
        data: { status: 'REJECTED', rejectionReason: props.rejectionReason },
      });
      return Result.ok(undefined);
    } catch (error) {
      console.error(error);
      return Result.fail('DATABASE_ERROR');
    }
  }
  async findAllByProjectId(
    projectId: string,
  ): Promise<Result<ApplicationProjectRole[], string>> {
    try {
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { projectId },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          projectRole: {
            select: {
              title: true,
              description: true,
              techStacks: true,
            },
          },
          project: {
            select: {
              title: true,
              description: true,
              image: true,
              owner: true,
            },
          },
          keyFeature: {
            select: {
              feature: true,
            },
          },
        },
      });
      console.log('applications', applications);
      return Result.ok(
        applications.map((application) => {
          const { keyFeature, ...applicationWithoutKeyFeature } = application;
          return {
            ...applicationWithoutKeyFeature,
            decidedAt: application.decidedAt?.toISOString(),
            decidedBy: application.decidedBy || undefined,
            appliedAt: application.createdAt.toISOString(),
            keyFeatures: [keyFeature.feature],
          };
        }),
      );
    } catch (error) {
      console.error(error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async findByRoleId(
    roleId: string,
  ): Promise<Result<ApplicationProjectRole, string>> {
    try {
      const application = await this.prisma.projectRoleApplication.findUnique({
        where: { id: roleId },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          projectRole: true,
          project: true,
          keyFeature: {
            select: {
              feature: true,
            },
          },
        },
      });
      if (!application) {
        return Result.fail('APPLICATION_NOT_FOUND');
      }
      const { keyFeature, ...applicationWithoutKeyFeature } = application;
      return Result.ok({
        ...applicationWithoutKeyFeature,
        decidedAt: application.decidedAt?.toISOString(),
        decidedBy: application.decidedBy || undefined,
        appliedAt: application.createdAt.toISOString(),
        keyFeatures: [keyFeature.feature],
      });
    } catch (error) {
      console.error(error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async findAllByUserId(
    userId: string,
  ): Promise<Result<ApplicationProjectRole[], string>> {
    try {
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          projectRole: true,
          project: true,
          keyFeature: {
            select: {
              feature: true,
            },
          },
        },
      });
      console.log('applications findAllByUserId', applications);
      return Result.ok(
        applications.map((application) => {
          const { keyFeature, ...applicationWithoutKeyFeature } = application;
          return {
            ...applicationWithoutKeyFeature,
            decidedAt: application.decidedAt?.toISOString(),
            decidedBy: application.decidedBy || undefined,
            appliedAt: application.createdAt.toISOString(),
            keyFeatures: [keyFeature.feature],
          };
        }),
      );
    } catch (error) {
      console.error(error);
      return Result.fail('DATABASE_ERROR');
    }
  }
}
