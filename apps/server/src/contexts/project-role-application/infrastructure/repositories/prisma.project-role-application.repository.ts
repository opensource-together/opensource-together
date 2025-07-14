import { PrismaService } from '@/orm/prisma/prisma.service';
import { ProjectRoleApplicationRepositoryPort } from '../../use-cases/ports/project-role-application.repository.port';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';
import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';

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
}
