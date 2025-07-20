import { Injectable } from '@nestjs/common';
import { ProjectRoleRepositoryPort } from '@/contexts/project/bounded-contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaProjectRoleMapper } from '@/contexts/project/bounded-contexts/project-role/infrastructure/repositories/prisma.project-role.mapper';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Result } from '@/libs/result';
import { ProjectRole } from '@/contexts/project/bounded-contexts/project-role/domain/project-role.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaProjectRoleRepository implements ProjectRoleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectRole: ProjectRole): Promise<Result<ProjectRole, string>> {
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
    const savedProjectRole = await this.prisma.projectRole.create({
      data: toRepo,
      include: {
        techStacks: true,
      },
    });
    const toDomain = PrismaProjectRoleMapper.toDomain(savedProjectRole);
    if (!toDomain.success) return Result.fail(toDomain.error as string);
    return Result.ok(toDomain.value);
  }

  async findById(id: string): Promise<Result<ProjectRole, string>> {
    try {
      const projectRole = await this.prisma.projectRole.findUnique({
        where: { id },
        include: {
          techStacks: true,
        },
      });

      if (!projectRole) {
        return Result.fail('Project role not found');
      }

      const toDomain = PrismaProjectRoleMapper.toDomain(projectRole);
      if (!toDomain.success) return Result.fail(toDomain.error as string);
      return Result.ok(toDomain.value);
    } catch (error) {
      return Result.fail(`Error finding project role: ${error}`);
    }
  }

  async update(projectRole: ProjectRole): Promise<Result<ProjectRole, string>> {
    try {
      const repoProjectRole = projectRole.toPrimitive();

      // Mise à jour avec gestion des relations techStacks
      const updatedProjectRole = await this.prisma.projectRole.update({
        where: { id: repoProjectRole.id },
        data: {
          title: repoProjectRole.title,
          description: repoProjectRole.description,
          isFilled: repoProjectRole.isFilled,
          techStacks: {
            set: [], // Supprimer toutes les relations existantes
            connect: repoProjectRole.techStacks.map((techStack) => ({
              id: techStack.id,
            })),
          },
        },
        include: {
          techStacks: true,
        },
      });

      const toDomain = PrismaProjectRoleMapper.toDomain(updatedProjectRole);
      if (!toDomain.success) return Result.fail(toDomain.error as string);
      return Result.ok(toDomain.value);
    } catch (error) {
      return Result.fail(`Error updating project role: ${error}`);
    }
  }

  async delete(id: string): Promise<Result<boolean, string>> {
    try {
      await this.prisma.projectRole.delete({
        where: { id },
      });
      return Result.ok(true);
    } catch (error) {
      return Result.fail(`Error deleting project role: ${error}`);
    }
  }

  async findAllByProjectId(
    projectId: string,
  ): Promise<Result<ProjectRole[], string>> {
    try {
      const projectRoles = await this.prisma.projectRole.findMany({
        where: { projectId },
        include: {
          techStacks: true,
        },
      });
      const toDomain: ProjectRole[] = [];
      for (const role of projectRoles) {
        const toDomainResult = PrismaProjectRoleMapper.toDomain(role);
        if (toDomainResult.success) {
          toDomain.push(toDomainResult.value);
        }
      }
      return Result.ok(toDomain);
    } catch (error) {
      return Result.fail(`Error finding all project roles: ${error}`);
    }
  }
}
