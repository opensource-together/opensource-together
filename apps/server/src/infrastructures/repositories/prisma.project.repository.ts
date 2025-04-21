import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '@application/ports/project.repository.port';
import { PrismaService } from '../orm/prisma/prisma.service';
import { Project } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/project.factory';
import { Result } from '@/shared/result';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { TechStack } from '@/domain/techStack/techstack.entity';

@Injectable()
export class PrismaProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(project: Project): Promise<void> {
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
        throw new Error('Project already exists');
      } else if (error.code === 'P2025') {
        throw new Error('TechStack not found');
      } else {
        throw new Error('Unknown error');
      }
    }
  }

  async findByTitle(title: string): Promise<Project[] | null> {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      console.log(title);
      throw new Error('❌ Le titre fourni est vide ou invalide');
    }

    console.log('🔍 Recherche du projet avec le titre :', title);

    const prismaProjects = await this.prisma.project.findMany({
      where: { title: title },
      include: { techStacks: true },
    });

    if (prismaProjects.length === 0) {
      return null;
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

    return projects;
  }

  // async findById(id: string): Promise<Project | null> {
  //   const project = await this.prisma.project.findUnique({
  //     where: { id },
  //     include: { techStacks: true },
  //   });
  // }

  // async findByUserId(userId: string): Promise<Project[] | null> {
  //   const projects = await this.prisma.project.findMany({
  //     where: { userId },
  //     include: { techStacks: true },
  //   });

  //   const result = projects.map((project) =>
  //     ProjectFactory.create(
  //       project.id,
  //       project.title,
  //       project.description,
  //       project.link,
  //       project.status,
  //       project.userId,
  //       project.techStacks,
  //     ),
  //   );

  //   // Filtrer les projets valides uniquement
  //   const validProjects = result
  //     .filter((res): res is Result<Project> & { success: true } => res.success)
  //     .map((res) => res.value);

  //   return validProjects.length > 0 ? validProjects : null;
  // }
}
