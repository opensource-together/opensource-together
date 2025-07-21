import {
  ProjectRole,
  ProjectRoleValidationErrors,
} from '@/contexts/project/bounded-contexts/project-role/domain/project-role.entity';
import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { Prisma, ProjectRole as PrismaProjectRole } from '@prisma/client';

@Injectable()
export class PrismaProjectRoleMapper {
  public static toRepo(projectRole: ProjectRole) {
    const repoProjectRole = projectRole.toPrimitive();
    const toRepo: Prisma.ProjectRoleCreateInput = {
      project: {
        connect: {
          id: repoProjectRole.projectId,
        },
      },
      title: repoProjectRole.title,
      description: repoProjectRole.description,
      isFilled: repoProjectRole.isFilled ?? false,
      techStacks: {
        connect: repoProjectRole.techStacks.map((techStack) => ({
          id: techStack.id,
        })),
      },
    };
    return toRepo;
  }
  public static toDomain(
    projectRoleRepo: PrismaProjectRole & {
      techStacks: {
        id: string;
        name: string;
        iconUrl: string;
        type: 'LANGUAGE' | 'TECH';
      }[];
    } & {
      createdAt: Date;
      updatedAt: Date;
    },
  ): Result<ProjectRole, ProjectRoleValidationErrors | string> {
    const domainProjectRole = ProjectRole.reconstitute({
      id: projectRoleRepo.id,
      projectId: projectRoleRepo.projectId,
      title: projectRoleRepo.title,
      description: projectRoleRepo.description,
      isFilled: projectRoleRepo.isFilled,
      techStacks: projectRoleRepo.techStacks.map((techStack) => ({
        id: techStack.id,
        name: techStack.name,
        iconUrl: techStack.iconUrl,
        type: techStack.type,
      })),
      createdAt: projectRoleRepo.createdAt,
      updatedAt: projectRoleRepo.updatedAt,
    });
    if (!domainProjectRole.success)
      return Result.fail(
        domainProjectRole.error as ProjectRoleValidationErrors,
      );
    return Result.ok(domainProjectRole.value);
  }
}
