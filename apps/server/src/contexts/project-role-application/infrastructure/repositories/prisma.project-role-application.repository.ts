import { PrismaClient } from '@prisma/client';
import { ProjectRoleApplicationRepositoryPort } from '../../use-cases/ports/project-role-application.repository.port';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';

export class PrismaProjectRoleApplicationRepository
  implements ProjectRoleApplicationRepositoryPort
{
  constructor(private readonly prisma: PrismaClient) {}

  async findByProjectRoleId(
    projectRoleId: string,
  ): Promise<ProjectRoleApplication[]> {
    const projectRoleApplications =
      await this.prisma.projectRoleApplication.findMany({
        where: { projectRoleId },
      });
    return projectRoleApplications.map((projectRoleApplication) =>
      ProjectRoleApplication.reconstitute(projectRoleApplication),
    );
  }

  async findByUserId(userId: string): Promise<ProjectRoleApplication[]> {
    const projectRoleApplications =
      await this.prisma.projectRoleApplication.findMany({
        where: { userId },
      });
    return projectRoleApplications.map((projectRoleApplication) =>
      ProjectRoleApplication.reconstitute(projectRoleApplication),
    );
  }

  async findById(id: string): Promise<ProjectRoleApplication | null> {
    const projectRoleApplication =
      await this.prisma.projectRoleApplication.findUnique({
        where: { id },
      });
    return projectRoleApplication
      ? ProjectRoleApplication.reconstitute(projectRoleApplication)
      : null;
  }

  async save(projectRoleApplication: ProjectRoleApplication): Promise<void> {
    await this.prisma.projectRoleApplication.upsert({
      where: { id: projectRoleApplication.id },
      update: projectRoleApplication.toPrimitive(),
      create: projectRoleApplication.toPrimitive(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.projectRoleApplication.delete({
      where: { id },
    });
  }
}
