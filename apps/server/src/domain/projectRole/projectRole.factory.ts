import { TechStack } from '@prisma/client';
import { ProjectRole } from './projectRole.entity';
import { Result } from '@/shared/result';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';

export class ProjectRoleFactory {
  static create({
    projectId,
    roleTitle,
    skillSet,
    description,
    isFilled,
  }: {
    projectId: string;
    roleTitle: string;
    skillSet: TechStack[];
    description: string;
    isFilled: boolean;
  }): Result<ProjectRole> {
    const techStackResult = TechStackFactory.createMany(skillSet);
    if (!techStackResult.success) {
      return Result.fail(techStackResult.error);
    }
    return Result.ok(
      new ProjectRole({
        projectId,
        roleTitle,
        skillSet: techStackResult.value,
        description,
        isFilled,
      }),
    );
  }

  static createMany(
    projectRoles: Array<{
      projectId: string;
      roleTitle: string;
      skillSet: TechStack[];
      description: string;
      isFilled: boolean;
    }>,
  ): Result<ProjectRole[]> {
    const results: ProjectRole[] = [];
    const errors: string[] = [];

    for (const projectRole of projectRoles) {
      const projectRoleResult = this.create({
        projectId: projectRole.projectId,
        roleTitle: projectRole.roleTitle,
        skillSet: projectRole.skillSet,
        description: projectRole.description,
        isFilled: projectRole.isFilled,
      });

      if (!projectRoleResult.success) {
        errors.push(projectRoleResult.error);
      } else {
        results.push(projectRoleResult.value);
      }
    }

    if (errors.length > 0) {
      return Result.fail(
        `Erreurs lors de la création des rôles de projet: ${errors.join(', ')}`,
      );
    }

    return Result.ok(results);
  }

  static fromPersistence(prismaProjectRole: {
    projectId: string;
    roleTitle: string;
    teamMembersIds: string[];
    description: string;
    isFilled: boolean;
  }): Result<{
    projectId: string;
    roleTitle: string;
    teamMembersIds: string[];
    description: string;
    isFilled: boolean;
  }> {
    return Result.ok({
      projectId: projectRole.getProjectId(),
      roleTitle: projectRole.getRoleTitle(),
      teamMembersIds: projectRole.getTeamMembersIds(),
      description: projectRole.getDescription(),
      isFilled: projectRole.getIsFilled(),
    });
  }
}
