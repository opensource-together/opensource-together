import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '@/application/project/ports/project.repository.port';
import { PrismaService } from '../orm/prisma/prisma.service';
import { Project } from '@/domain/project/project.entity';
import { Result } from '@/shared/result';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaProjectMapper } from './project/prisma.project.mapper';
import { UpdateProjectInputsDto } from '@/application/dto/inputs/update-project-inputs.dto';
import { ProjectFilterInputsDto } from '@/application/dto/inputs/filter-project-input';
@Injectable()
export class PrismaProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(project: Project): Promise<Result<Project>> {
    try {
      const repoProject = PrismaProjectMapper.toRepo(project);
      if (!repoProject.success) return Result.fail(repoProject.error);

      const savedProject = await this.prisma.project.create({
        data: repoProject.value,
        include: {
          techStacks: true,
          projectRoles: {
            include: {
              skillSet: true,
            },
          },
          projectMembers: true,
        },
      });
      const domainProject = PrismaProjectMapper.toDomain(savedProject);
      if (!domainProject.success) return Result.fail(domainProject.error);
      return Result.ok(domainProject.value);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return Result.fail('Project already exists');
        } else if (error.code === 'P2003') {
          // P2003 indicates a foreign key constraint violation
          return Result.fail(
            'Related record not found (e.g., invalid user or tech stack)',
          );
        }
        // P2025 can indicate a required record was not found
        else if (error.code === 'P2025') {
          return Result.fail(
            'Required record not found during creation (e.g., TechStack)',
          );
        }
      }
      // Catch any other errors that are not PrismaClientKnownRequestError
      return Result.fail(`Unknown error during project creation: ${error}`);
    }
  }

  async updateProjectById(
    id: string,
    payload: UpdateProjectInputsDto,
    ownerId: string,
  ): Promise<Result<Project>> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
      });
      if (!project) return Result.fail('Project not found');
      if (project.ownerId !== ownerId)
        return Result.fail('You are not allowed to update this project');

      const updatePayload = {
        title: payload.title?.success
          ? payload.title.value.getTitle()
          : undefined,
        description: payload.description?.success
          ? payload.description.value.getDescription()
          : undefined,
        link: payload.link?.success ? payload.link.value.getLink() : undefined,
        ...(payload.techStacks && {
          techStacks: {
            // Déconnecte toutes les techStacks existantes
            set: [],
            // Connecte les nouvelles techStacks en utilisant leurs IDs
            connect: payload.techStacks.map((techStack) => ({
              id: techStack.id,
            })),
          },
        }),
      };

      const updatedProject = await this.prisma.project.update({
        where: { id },
        data: updatePayload,
        include: {
          techStacks: true,
          projectRoles: {
            include: { skillSet: true },
          },
          projectMembers: true,
        },
      });

      const domainProject = PrismaProjectMapper.toDomain(updatedProject);
      if (!domainProject.success) return Result.fail(domainProject.error);

      return Result.ok(domainProject.value);
    } catch (error) {
      return Result.fail('Unknown error');
    }
  }

  async findProjectByFilters(
    filters: ProjectFilterInputsDto,
  ): Promise<Result<Project[] | null>> {
    try {
      // Construction dynamique du where clause
      const where: any = {};

      // Filtre par titre (utilise idx_title_search)
      if (filters.title && filters.title.trim() !== '') {
        where.title = {
          contains: filters.title,
          mode: 'insensitive',
        };
      }

      // Filtre par difficulté (utilise idx_difficulty_date)
      if (filters.difficulty) {
        where.difficulty = filters.difficulty.toUpperCase();
      }

      // Filtre par rôles (utilise idx_project_roles)
      if (filters.roles && filters.roles.length > 0) {
        where.projectRoles = {
          some: {
            roleTitle: {
              in: filters.roles,
              mode: 'insensitive',
            },
          },
        };
      }

      // Filtre par technologies (utilise les index sur _ProjectToTechStack)
      if (filters.techStacks && filters.techStacks.length > 0) {
        where.techStacks = {
          some: {
            name: {
              in: filters.techStacks,
              mode: 'insensitive',
            },
          },
        };
      }

      // Configuration du tri (utilise idx_difficulty_date si difficulté présente)
      const orderBy: any = [];
      if (filters.sortOrder === 'asc') {
        orderBy.push({ createAt: 'asc' });
      } else {
        orderBy.push({ createAt: 'desc' }); // Défaut descendant
      }

      const prismaProjects = await this.prisma.project.findMany({
        where,
        orderBy,
        include: {
          techStacks: true,
          projectRoles: {
            include: { skillSet: true },
          },
          projectMembers: true,
        },
      });

      if (prismaProjects.length === 0) return Result.ok(null);

      const domainProjects: Project[] = [];

      for (const projectPrisma of prismaProjects) {
        const domainProject = PrismaProjectMapper.toDomain(projectPrisma);
        if (!domainProject.success) return Result.fail(domainProject.error);
        domainProjects.push(domainProject.value);
      }

      return Result.ok(domainProjects);
    } catch (error) {
      return Result.fail('Unknown error');
    }
  }

  async findProjectById(id: string): Promise<Result<Project>> {
    try {
      const projectPrisma = await this.prisma.project.findUnique({
        where: { id },
        include: {
          techStacks: true,
          projectRoles: {
            include: { skillSet: true },
          },
          projectMembers: true,
        },
      });

      if (!projectPrisma) return Result.fail('Project not found');

      const domainProject = PrismaProjectMapper.toDomain(projectPrisma);
      if (!domainProject.success) return Result.fail(domainProject.error);

      return Result.ok(domainProject.value);
    } catch (error) {
      return Result.fail('Unknown error');
    }
  }

  async getAllProjects(): Promise<Result<Project[]>> {
    try {
      const projectsPrisma = await this.prisma.project.findMany({
        include: {
          techStacks: true,
          projectRoles: {
            include: { skillSet: true },
          },
          projectMembers: true,
        },
      });

      if (!projectsPrisma) return Result.ok([]);

      const domainProjects: Project[] = [];

      for (const projectPrisma of projectsPrisma) {
        const domainProject = PrismaProjectMapper.toDomain(projectPrisma);
        if (!domainProject.success) return Result.fail(domainProject.error);
        domainProjects.push(domainProject.value);
      }

      return Result.ok(domainProjects);
    } catch (error) {
      return Result.fail('Unknown error');
    }
  }
}
