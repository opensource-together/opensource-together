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
        user: {
          include: {
            profile: true;
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
      userId: prismaEntity.user.id,
      projectId: prismaEntity.project.id,
      projectRoleId: prismaEntity.projectRole.id,
      projectRoleTitle: prismaEntity.projectRole.title,
      selectedKeyFeatures: prismaEntity.selectedKeyFeatures,
      selectedProjectGoals: prismaEntity.selectedProjectGoals,
      rejectionReason: prismaEntity.rejectionReason ?? undefined,
      status: prismaEntity.status as ApplicationStatus,
      appliedAt: prismaEntity.appliedAt,
      // Gérer le cas où le profile peut être null et convertir null en undefined
      userProfile: prismaEntity.user.profile
        ? {
            id: prismaEntity.user.id,
            name: prismaEntity.user.profile.name,
            avatarUrl: prismaEntity.user.profile.avatarUrl ?? undefined, // Convertir null en undefined
          }
        : undefined,
    });
    if (!domainEntity.success) {
      return Result.fail(domainEntity.error);
    }
    return Result.ok(domainEntity.value);
  }
}
