import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { ProjectRoleApplicationRepositoryPort } from '../../use-cases/ports/project-role-application.repository.port';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';
import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { PrismaProjectRoleApplicationMapper } from './prisma.project-role-application.mapper';

@Injectable()
export class PrismaProjectRoleApplicationRepository
  implements ProjectRoleApplicationRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    application: ProjectRoleApplication,
  ): Promise<Result<ProjectRoleApplication, string>> {
    try {
      const toRepo = application.toPrimitive();
      await this.prisma.projectRoleApplication.create({
        data: toRepo,
      });
      return Result.ok(application);
    } catch (error) {
      console.error(error);
      return Result.fail('Une erreur est survenur');
    }
  }

  async existsPendingApplication(
    userId: string,
    projectRoleId: string,
  ): Promise<Result<boolean, string>> {
    try {
      const projectRoleApplication =
        await this.prisma.projectRoleApplication.findFirst({
          where: {
            userId,
            projectRoleId,
            status: 'PENDING',
          },
        });
      console.log('projectRoleApplication', !!projectRoleApplication);

      return Result.ok(!!projectRoleApplication);
    } catch (error) {
      console.error(error);
      return Result.fail('Une erreur est survenur');
    }
  }

  async findAllByProjectId(projectId: string): Promise<
    Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl: string;
        };
      }[],
      string
    >
  > {
    try {
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { projectId: { equals: projectId } },
        include: {
          user: {
            include: {
              profile: true, // Inclure le profile
            },
          },
          projectRole: true,
          project: true,
        },
      });
      if (!applications) {
        return Result.ok([]);
      }

      const projectRoleApplications: {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl: string;
        };
      }[] = [];

      for (const application of applications) {
        const domainApplication =
          PrismaProjectRoleApplicationMapper.toDomain(application);
        if (!domainApplication.success) {
          return Result.fail(
            'Une erreur est survenue lors de la récupération des candidatures',
          );
        }
        projectRoleApplications.push({
          appplicationId: domainApplication.value.id!,
          projectRoleId: domainApplication.value.projectRoleId,
          projectRoleTitle: domainApplication.value.projectRoleTitle,
          status: domainApplication.value.status,
          selectedKeyFeatures: domainApplication.value.selectedKeyFeatures,
          selectedProjectGoals: domainApplication.value.selectedProjectGoals,
          appliedAt: domainApplication.value.appliedAt,
          decidedAt: domainApplication.value.decidedAt!,
          decidedBy: domainApplication.value.decidedBy!,
          rejectionReason: domainApplication.value.rejectionReason!,
          userProfile: {
            id: domainApplication.value.userProfile!.id,
            name: domainApplication.value.userProfile!.name,
            avatarUrl: domainApplication.value.userProfile!.avatarUrl!,
          },
        });
      }

      return Result.ok(projectRoleApplications);
    } catch (error) {
      console.error(error);
      return Result.fail(
        'Une erreur est survenue lors de la récupération des candidatures',
      );
    }
  }
}
