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
          id: domainEntity.userProfile.id,
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
      projectTitle: domainEntity.project.title,
      projectDescription: domainEntity.project.description,
      projectRoleTitle: domainEntity.projectRoleTitle,
      status: domainEntity.status,
      motivationLetter: domainEntity.motivationLetter,
      selectedKeyFeatures: {
        connect: domainEntity.selectedKeyFeatures.map((kf) => ({
          id: kf.toPrimitive().id,
        })),
      },
      selectedProjectGoals: {
        connect: domainEntity.selectedProjectGoals.map((pg) => ({
          id: pg.toPrimitive().id,
        })),
      },
      rejectionReason: domainEntity.rejectionReason,
    };
    return Result.ok(toRepo);
  }

  static toDomain(
    prismaEntity: Prisma.ProjectRoleApplicationGetPayload<{
      include: {
        user: true;
        projectRole: true;
        project: {
          include: {
            keyFeatures: true;
            projectGoals: true;
            owner?: true;
          };
        };
      };
    }>,
  ): Result<
    ProjectRoleApplication,
    ProjectRoleApplicationValidationErrors | string
  > {
    const domainEntity = ProjectRoleApplication.reconstitute({
      id: prismaEntity.id,
      projectId: prismaEntity.projectId,
      projectTitle: prismaEntity.projectTitle,
      project: {
        id: prismaEntity.project.id,
        title: prismaEntity.project.title,
        shortDescription: prismaEntity.project.shortDescription,
        description: prismaEntity.project.description,
        image: prismaEntity.project.image ?? undefined,
        owner: prismaEntity.project.owner
          ? {
              id: prismaEntity.project.owner.id,
              username: prismaEntity.project.owner.username,
              login: prismaEntity.project.owner.login,
              email: prismaEntity.project.owner.email,
              provider: prismaEntity.project.owner.provider,
              jobTitle: prismaEntity.project.owner.jobTitle,
              location: prismaEntity.project.owner.location,
              company: prismaEntity.project.owner.company,
              bio: prismaEntity.project.owner.bio,
              createdAt: prismaEntity.project.owner.createdAt,
              updatedAt: prismaEntity.project.owner.updatedAt,
              avatarUrl: prismaEntity.project.owner.avatarUrl,
            }
          : {
              id: 'unknown',
              username: 'unknown',
              login: 'unknown',
              email: 'unknown',
              provider: 'unknown',
              jobTitle: null,
              location: null,
              company: null,
              bio: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              avatarUrl: null,
            },
      },
      projectDescription: prismaEntity.projectDescription ?? undefined,
      projectRoleId: prismaEntity.projectRole.id,
      projectRoleTitle: prismaEntity.projectRole.title,
      selectedKeyFeatures: prismaEntity.project.keyFeatures,
      selectedProjectGoals: prismaEntity.project.projectGoals,
      rejectionReason: prismaEntity.rejectionReason ?? undefined,
      status: prismaEntity.status as ApplicationStatus,
      appliedAt: prismaEntity.appliedAt,
      decidedAt: prismaEntity.decidedAt ?? undefined,
      decidedBy: prismaEntity.decidedBy ?? undefined,
      motivationLetter: prismaEntity.motivationLetter ?? undefined,
      userProfile: {
        id: prismaEntity.user.id,
        username: prismaEntity.user.username ?? '',
        avatarUrl: prismaEntity.user.avatarUrl ?? undefined,
      },
    });
    if (!domainEntity.success) {
      return Result.fail(domainEntity.error);
    }
    return Result.ok(domainEntity.value);
  }
}
