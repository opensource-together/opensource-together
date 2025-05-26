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

  static fromPersistence(
    prismaProjectRoles: {
      id: string;
      projectId: string;
      roleTitle: string;
      description: string;
      isFilled: boolean;
      skillSet: {
        id: string;
        name: string;
        iconUrl: string;
      }[];
    }[],
  ): Result<
    {
      id: string;
      projectId: string;
      roleTitle: string;
      description: string;
      isFilled: boolean;
      skillSet: TechStack[];
    }[]
  > {
    const mappedProjectRoles = prismaProjectRoles.map((prismaRole) => {
      // 1. Transformer le skillSet spécifique de CE prismaRole
      const skillSetResult = TechStackFactory.createMany(
        prismaRole.skillSet || [],
      );

      // 2. Vérifier si la transformation a réussi pour CE skillSet
      if (!skillSetResult.success) {
        // Retourner un objet marqué comme invalide ou lancer/propager une erreur ici.
        // Pour la concision, nous allons retourner un skillSet vide en cas d'erreur,
        // mais dans une vraie application, vous devriez gérer cette erreur plus robustement.
        // Ou mieux, faire échouer toute la transformation si un skillSet échoue.
        // Pour l'instant, pour que ça compile et illustre la logique:
        return {
          id: prismaRole.id,
          projectId: prismaRole.projectId,
          roleTitle: prismaRole.roleTitle,
          description: prismaRole.description,
          isFilled: prismaRole.isFilled,
          skillSet: [], // ou skillSetResult.error pour tracer
          _error: skillSetResult.error, // Pour tracer l'erreur
        };
      }

      // 3. Construire l'objet ProjectRole de domaine avec le skillSet transformé
      return {
        id: prismaRole.id,
        projectId: prismaRole.projectId,
        roleTitle: prismaRole.roleTitle,
        description: prismaRole.description,
        isFilled: prismaRole.isFilled,
        skillSet: skillSetResult.value, // skillSetResult.value est TechStack[] (entités de domaine)
      };
    });

    // Vérifier si des erreurs ont été marquées pendant le mapping
    const rolesWithError = mappedProjectRoles.filter((role) =>
      Reflect.has(role, '_error'),
    );
    if (rolesWithError.length > 0) {
      const errorMessages = rolesWithError
        .map((role) => `Role ${role.id}: ${Reflect.get(role, '_error')}`)
        .join('; ');
      return Result.fail(
        `Errors during persistence mapping for ProjectRoles: ${errorMessages}`,
      );
    }

    // Enlever la propriété _error temporaire si elle existe
    const finalRoles = mappedProjectRoles.map((role) => {
      const { _error, ...rest } = role as any; // eslint-disable-line @typescript-eslint/no-unused-vars
      return rest;
    });

    return Result.ok(finalRoles);
  }
}
