import { ProjectRole as DomainProjectRole } from '@/domain/projectRole/projectRole.entity';
import { Result } from '@/shared/result';
import {
  ProjectRole as PrismaProjectRole,
  TechStack,
  Prisma,
} from '@prisma/client';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';

type PrismaProjectRoleWithIncludes = PrismaProjectRole & {
  skillSet: TechStack[];
};

export class PrismaProjectRoleMapper {
  /**
   * Convertit une entité ProjectRole du domaine en objet pour création avec Prisma
   */
  static toRepo(
    projectRole: DomainProjectRole,
  ): Result<Prisma.ProjectRoleCreateInput> {
    return Result.ok({
      roleTitle: projectRole.getRoleTitle(),
      description: projectRole.getDescription(),
      isFilled: projectRole.getIsFilled(),
      project: {
        connect: {
          id: projectRole.getProjectId(),
        },
      },
      skillSet: {
        connect: projectRole.getSkillSet().map((tech) => ({
          id: tech.getId(),
        })),
      },
    });
  }

  /**
   * Convertit un objet ProjectRole de Prisma en entité ProjectRole du domaine
   */
  static toDomain(
    prismaProjectRole: PrismaProjectRoleWithIncludes,
  ): Result<DomainProjectRole> {
    // Transformer les techStacks de la skillSet
    const skillSetResult = TechStackFactory.fromPersistence(
      prismaProjectRole.skillSet,
    );
    if (!skillSetResult.success) return Result.fail(skillSetResult.error);

    // Créer l'entité de domaine
    return Result.ok(
      new DomainProjectRole({
        id: prismaProjectRole.id,
        projectId: prismaProjectRole.projectId,
        roleTitle: prismaProjectRole.roleTitle,
        description: prismaProjectRole.description,
        isFilled: prismaProjectRole.isFilled,
        skillSet: skillSetResult.value,
      }),
    );
  }

  /**
   * Convertit un tableau d'objets ProjectRole de Prisma en tableau d'entités ProjectRole du domaine
   */
  static toDomainCollection(
    prismaProjectRoles: PrismaProjectRoleWithIncludes[],
  ): Result<DomainProjectRole[]> {
    const domainProjectRoles: DomainProjectRole[] = [];

    for (const prismaProjectRole of prismaProjectRoles) {
      const domainProjectRole = this.toDomain(prismaProjectRole);
      if (!domainProjectRole.success)
        return Result.fail(domainProjectRole.error);
      domainProjectRoles.push(domainProjectRole.value);
    }

    return Result.ok(domainProjectRoles);
  }

  /**
   * Convertit une entité ProjectRole du domaine en objet pour mise à jour avec Prisma
   */
  static toRepoForUpdate(
    projectRole: DomainProjectRole,
  ): Result<Prisma.ProjectRoleUpdateInput> {
    return Result.ok({
      roleTitle: projectRole.getRoleTitle(),
      description: projectRole.getDescription(),
      isFilled: projectRole.getIsFilled(),
      skillSet: {
        set: [], // On repart à zéro
        connect: projectRole.getSkillSet().map((tech) => ({
          id: tech.getId(),
        })),
      },
    });
  }
}
