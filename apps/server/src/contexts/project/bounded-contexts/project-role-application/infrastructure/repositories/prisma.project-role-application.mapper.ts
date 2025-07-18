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
      profile: {
        connect: {
          userId: domainEntity.userProfile.id,
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
      projectRoleTitle: domainEntity.projectRoleTitle,
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
        profile: {
          include: {
            user: true;
          };
        };
        projectRole: true;
        project: true;
      };
    }>,
  ): Result<
    ProjectRoleApplication,
    ProjectRoleApplicationValidationErrors | string
  > {
    const domainEntity = ProjectRoleApplication.reconstitute({
      id: prismaEntity.id,
      projectId: prismaEntity.projectId,
      projectRoleId: prismaEntity.projectRole.id,
      projectRoleTitle: prismaEntity.projectRole.title,
      selectedKeyFeatures: prismaEntity.selectedKeyFeatures,
      selectedProjectGoals: prismaEntity.selectedProjectGoals,
      rejectionReason: prismaEntity.rejectionReason ?? undefined,
      status: prismaEntity.status as ApplicationStatus,
      appliedAt: prismaEntity.appliedAt,
      motivationLetter: prismaEntity.motivationLetter ?? undefined,
      userProfile: {
        id: prismaEntity.profile.userId,
        name: prismaEntity.profile.name ?? '',
        avatarUrl: prismaEntity.profile.avatarUrl ?? undefined,
      },
    });
    if (!domainEntity.success) {
      return Result.fail(domainEntity.error);
    }
    return Result.ok(domainEntity.value);
  }
}
