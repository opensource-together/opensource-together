import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from './application.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { Result } from '@/libs/result';
import { Application } from '../domain/application';

@Injectable()
export class PrismaApplicationRepository implements ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(application: Application): Promise<Result<Application, string>> {
    try {
      //   const createdApplication =
      //     await this.prisma.projectRoleApplication.create({
      //       data: {
      //         ...application,
      //         projectId: application.projectId,
      //         projectRoleId: application.projectRoleId,
      //         status: application.status,
      //         motivationLetter: application.motivationLetter,
      //         rejectionReason: application.rejectionReason,
      //         appliedAt: application.appliedAt,
      //         decidedAt: application.decidedAt,
      //         decidedBy: application.decidedBy,
      //         user: {
      //           connect: {
      //             id: application.user.id,
      //           },
      //         },
      //       },
      //     });
      return Promise.resolve(
        Result.ok({
          ...application,
          user: {
            id: application.user.id,
            name: application.user.name,
            avatarUrl: application.user.avatarUrl,
          },
          decidedBy: {
            id: application.decidedBy.id,
            name: application.decidedBy.name,
            avatarUrl: application.decidedBy.avatarUrl,
          },
        }),
      );
    } catch (error) {
      console.log('error', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
}
