import { Injectable } from '@nestjs/common';
import { ProjectRoleRepositoryPort } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaProjectRoleMapper } from '@/contexts/project-role/infrastructure/repositories/prisma.project-role.mapper';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { Result } from '@/libs/result';
import { ProjectRole } from '@/contexts/project-role/domain/project-role.entity';
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
}
