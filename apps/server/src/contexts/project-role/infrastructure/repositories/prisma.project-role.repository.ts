import { Injectable } from '@nestjs/common';
import { ProjectRoleRepositoryPort } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import { PrismaProjectRoleMapper } from '@/contexts/project-role/infrastructure/repositories/prisma.project-role.mapper';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { Result } from '@/shared/result';
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
}
