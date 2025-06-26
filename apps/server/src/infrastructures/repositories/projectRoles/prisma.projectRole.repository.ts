import { Injectable } from '@nestjs/common';
import { ProjectRoleRepositoryPort } from '@/application/project/ports/projectRole.repository.port';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { Result } from '@/shared/result';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateProjectRoleInputsDto } from '@/application/dto/inputs/create-project-role-inputs.dto';
import { UpdateProjectRoleInputsDto } from '@/application/dto/inputs/update-project-role-inputs.dto';
import { ProjectRole } from '@/domain/projectRole/projectRole.entity';
import { PrismaProjectRoleMapper } from '../projectRoles/prisma.projectRole.mapper';

@Injectable()
export class PrismaProjectRoleRepository implements ProjectRoleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau rôle de projet
   * @returns Le rôle de projet créé
   */
  async createProjectRole(
    payload: CreateProjectRoleInputsDto,
  ): Promise<Result<ProjectRole>> {
    try {
      // Vérifier que le projet existe
      const project = await this.prisma.project.findUnique({
        where: { id: payload.projectId },
      });

      if (!project) {
        return Result.fail('Project not found');
      }

      // Vérifier que toutes les techStacks existent
      if (payload.skillSet && payload.skillSet.length > 0) {
        const skillIds = payload.skillSet.map((skill) => skill.id);
        const existingSkills = await this.prisma.techStack.findMany({
          where: {
            id: {
              in: skillIds,
            },
          },
        });

        // Vérifier si toutes les techStacks ont été trouvées
        if (existingSkills.length !== skillIds.length) {
          const foundIds = existingSkills.map((skill) => skill.id);
          const missingIds = skillIds.filter((id) => !foundIds.includes(id));
          return Result.fail(
            `One or more techStacks do not exist: ${missingIds.join(', ')}`,
          );
        }
      }

      // Créer le rôle de projet avec ses compétences associées
      const createdRole = await this.prisma.projectRole.create({
        data: {
          roleTitle: payload.roleTitle,
          description: payload.description,
          isFilled: payload.isFilled,
          project: { connect: { id: payload.projectId } },
          skillSet: {
            connect: payload.skillSet.map((skill) => ({ id: skill.id })),
          },
        },
        include: {
          skillSet: true,
        },
      });

      // Convertir l'entité Prisma en entité du domaine
      const domainRole = PrismaProjectRoleMapper.toDomain(createdRole);
      if (!domainRole.success) return Result.fail(domainRole.error);

      return Result.ok(domainRole.value);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return Result.fail('Project role already exists');
        }
        if (error.code === 'P2003') {
          return Result.fail('Related record not found (e.g., invalid skill)');
        }
      }
      return Result.fail(`Unknown error: ${error}`);
    }
  }

  /**
   * Met à jour un rôle de projet par son ID
   * @returns Le rôle de projet mis à jour au lieu d'un booléen pour plus de cohérence
   */
  async updateProjectRoleById(
    projectId: string,
    roleId: string,
    ownerId: string,
    payload: UpdateProjectRoleInputsDto,
  ): Promise<Result<ProjectRole>> {
    try {
      // Utiliser une transaction si on modifie les skillSets
      let updatedRole;
      if (payload.skillSet) {
        updatedRole = await this.prisma.$transaction(async (tx) => {
          return tx.projectRole.update({
            where: { id: roleId },
            data: {
              roleTitle: payload.roleTitle,
              description: payload.description,
              isFilled: payload.isFilled,
              skillSet: {
                set: [], // Vider les skills existants
                connect: payload.skillSet!.map((skill) => ({ id: skill.id })),
              },
            },
            include: {
              skillSet: true,
            },
          });
        });
      } else {
        // Mise à jour simple sans skillSets
        updatedRole = await this.prisma.projectRole.update({
          where: { id: roleId },
          data: {
            roleTitle: payload.roleTitle,
            description: payload.description,
            isFilled: payload.isFilled,
          },
          include: {
            skillSet: true,
          },
        });
      }

      // Convertir l'entité Prisma en entité de domaine
      const domainRole = PrismaProjectRoleMapper.toDomain(updatedRole);
      if (!domainRole.success) return Result.fail(domainRole.error);

      return Result.ok(domainRole.value);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return Result.fail('Role not found or SkillSet not found');
        }
      }
      return Result.fail(`Unknown error: ${error}`);
    }
  }

  /**
   * Supprime un rôle de projet par son ID
   * @returns true si la suppression a réussi
   */
  async deleteProjectRoleById(roleId: string): Promise<Result<boolean>> {
    try {
      // Supprimer le rôle
      await this.prisma.projectRole.delete({
        where: {
          id: roleId,
        },
      });

      return Result.ok(true);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return Result.fail('Role not found');
        }
        if (error.code === 'P2003') {
          return Result.fail(
            'Cannot delete role: it may still be referenced elsewhere',
          );
        }
      }
      return Result.fail(`Unknown error during role deletion: ${error}`);
    }
  }
}
