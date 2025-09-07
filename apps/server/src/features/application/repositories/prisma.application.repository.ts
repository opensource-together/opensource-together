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
  }): Promise<Result<ApplicationProjectRole, string>> {
    try {
      const createdApplication =
        await this.prisma.projectRoleApplication.create({
          data: {
            userId: application.userId,
            projectId: application.projectId,
            projectRoleId: application.projectRoleId,
            status: 'PENDING',
            motivationLetter: application.motivationLetter,
          },
        });
      return Result.ok({
        ...createdApplication,
        decidedBy: undefined,
        decidedAt: undefined,
        appliedAt: createdApplication.createdAt.toISOString(),
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
          status: { in: ['PENDING', 'REJECTED', 'ACCEPTED'] },
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
}
