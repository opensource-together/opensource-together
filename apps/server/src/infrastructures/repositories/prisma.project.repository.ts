import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '@application/ports/project.repository.port';
import { PrismaService } from '../orm/prisma/prisma.service';
import { Project } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/project.factory';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { Result } from '@/shared/result';

@Injectable()
export class PrismaProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(project: Project): Promise<Result<Project>> {
    try {
      await this.prisma.project.create({
        data: {
          techStacks: {
            connect: project.getTechStacks().map((techStack) => ({
              id: techStack.getId(),
            })),
          },
          title: project.getTitle(),
          description: project.getDescription(),
          link: project.getLink(),
          status: project.getStatus(),
          userId: project.getUserId(),
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return Result.fail('Project already exists');
      } else if (error.code === 'P2025') {
        return Result.fail('TechStack not found');
      } else {
        return Result.fail('Unknown error');
      }
    }
    return Result.ok(project);
  }

  async findProjectByTitle(title: string): Promise<Result<Project[] | null>> {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return Result.fail('❌ Le titre fourni est vide ou invalide');
    }

    const prismaProjects = await this.prisma.project.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      include: { techStacks: true },
    });

    if (prismaProjects.length === 0) {
      return Result.fail('❌ Aucun projet trouvé');
    }

    const projects = prismaProjects.map((prismaProject) => {
      const techStacksResult = TechStackFactory.createMany(
        prismaProject.techStacks,
      );

      if (!techStacksResult.success) {
        throw new Error('Error creation techStacks');
      }

      const project = ProjectFactory.create(
        prismaProject.id,
        prismaProject.title,
        prismaProject.description,
        prismaProject.link,
        prismaProject.status,
        prismaProject.userId,
        techStacksResult.value,
      );

      if (!project.success) {
        throw new Error('Erreur creation project');
      }

      return project.value;
    });

    return Result.ok(projects);
  }

  async findProjectById(id: string): Promise<Result<Project | null>> {
    const projectPrisma = await this.prisma.project.findUnique({
      where: { id },
      include: { techStacks: true },
    });

    if (!projectPrisma) {
      return Result.fail('Error project not found');
    }

    const techStacks = TechStackFactory.createMany(projectPrisma.techStacks);

    if (!techStacks.success) {
      return Result.fail("Erreur lors de la creation de l'entité techStacks");
    }

    const project = ProjectFactory.create(
      projectPrisma.id,
      projectPrisma.title,
      projectPrisma.description,
      projectPrisma.link,
      projectPrisma.status,
      projectPrisma.userId,
      techStacks.value,
    );

    if (!project.success) {
      throw new Error("Erreur lors de la creation de l'entité project");
    }

    return Result.ok(project.value);
  }

  async getAllProjects(): Promise<Result<Project[]>> {
    const projectsPrisma = await this.prisma.project.findMany({
      include: { techStacks: true },
    });

    if (!projectsPrisma) {
      return Result.fail('Error projects not found');
    }

    const projects = projectsPrisma.map((projectPrisma) => {
      const techStacks = TechStackFactory.createMany(projectPrisma.techStacks);
      if (!techStacks.success) {
        throw new Error('Error creation techStacks');
      }

      const project = ProjectFactory.create(
        projectPrisma.id,
        projectPrisma.title,
        projectPrisma.description,
        projectPrisma.link,
        projectPrisma.status,
        projectPrisma.userId,
        techStacks.value,
      );

      if (!project.success) {
        throw new Error('Error creation project');
      }

      return project.value;
    });
    return Result.ok(projects);
  }
}
