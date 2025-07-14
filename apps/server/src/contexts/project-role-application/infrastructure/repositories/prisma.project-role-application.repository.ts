import { PrismaClient } from '@prisma/client';
import { ProjectRoleApplicationRepositoryPort } from '../../use-cases/ports/project-role-application.repository.port';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';
import { Result } from '@/libs/result';

export class PrismaProjectRoleApplicationRepository
  implements ProjectRoleApplicationRepositoryPort
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    application: ProjectRoleApplication,
  ): Promise<Result<ProjectRoleApplication, string>> {
    try {
      const toRepo = application.toPrimitive();
      const projectRoleApplication =
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
          where: { userId, projectRoleId, status: 'PENDING' },
        });
      return Result.ok(!!projectRoleApplication);
    } catch (error) {
      console.error(error);
      return Result.fail('Une erreur est survenur');
    }
  }
}
