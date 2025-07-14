import { Prisma } from '@prisma/client';
import {
  ApplicationStatus,
  ProjectRoleApplication,
  ProjectRoleApplicationValidationErrors,
} from '../../domain/project-role-application.entity';
import { Result } from '@/libs/result';

export class PrismaProjectRoleApplicationMapper {
  static toRepo(
    domainEntity: ProjectRoleApplication,
  ): Result<Prisma.ProjectRoleApplicationCreateInput, string> {
    const toRepo: Prisma.ProjectRoleApplicationCreateInput = {
      user: {
        connect: {
          id: domainEntity.userId,
        },
      },
      projectRole: {
        connect: {
          id: domainEntity.projectRoleId,
        },
      },
      project: {
        connect: {
          id: domainEntity.projectId,
        },
      },
      status: domainEntity.status,
      motivationLetter: domainEntity.motivationLetter,
      selectedKeyFeatures: domainEntity.selectedKeyFeatures,
      selectedProjectGoals: domainEntity.selectedProjectGoals,
      rejectionReason: domainEntity.rejectionReason,
    };
    return Result.ok(toRepo);
  }

  static toDomain(
    prismaEntity: Prisma.ProjectRoleApplicationGetPayload<{
      include: {
        user: true;
        projectRole: true;
        project: true;
      };
    }>,
  ): Result<
    ProjectRoleApplication,
    ProjectRoleApplicationValidationErrors | string
  > {
    const domainEntity = ProjectRoleApplication.reconstitute({
      userId: prismaEntity.user.id,
      projectId: prismaEntity.project.id,
      projectRoleId: prismaEntity.projectRole.id,
      selectedKeyFeatures: prismaEntity.selectedKeyFeatures,
      selectedProjectGoals: prismaEntity.selectedProjectGoals,
      rejectionReason: prismaEntity.rejectionReason ?? undefined,
      status: prismaEntity.status as ApplicationStatus,
    });
    if (!domainEntity.success) {
      return Result.fail(domainEntity.error);
    }
    return Result.ok(domainEntity.value);
  }
}
