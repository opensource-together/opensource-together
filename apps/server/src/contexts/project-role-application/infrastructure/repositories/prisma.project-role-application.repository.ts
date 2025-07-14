import { PrismaService } from '@/orm/prisma/prisma.service';
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

  async findAllByProjectId(
    projectId: string,
  ): Promise<Result<ProjectRoleApplication[], string>> {
    try {
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { projectId: { equals: projectId } },
        include: {
          user: true,
          projectRole: true,
          project: true,
        },
      });
      if (!applications) {
        return Result.ok([]);
      }

      const projectRoleApplications: ProjectRoleApplication[] = [];

      for (const application of applications) {
        const domainApplication =
          PrismaProjectRoleApplicationMapper.toDomain(application);
        if (!domainApplication.success) {
          return Result.fail(
            'Une erreur est survenue lors de la récupération des candidatures',
          );
        }
        projectRoleApplications.push(domainApplication.value);
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
