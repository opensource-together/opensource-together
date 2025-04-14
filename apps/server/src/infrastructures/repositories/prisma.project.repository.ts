import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '@application/ports/project.repository.port';
import { PrismaService } from '../orm/prisma/prisma.service';
import { Project } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/project.factory';
import { Result } from '@/shared/result';

@Injectable()
export class PrismaProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(project: Project): Promise<void> {
    await this.prisma.project.create({
      data: {
        id: project.getId(),
        title: project.getTitle(),
        description: project.getDescription(),
        link: project.getLink(),
        status: project.getStatus(),
        userId: project.getUserId(),
        techStacks: project.getTechStacks(),
      },
    });
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { techStacks: true },
    });

    if (!project) return null;

    const result = ProjectFactory.create(
      project.id,
      project.title,
      project.description,
      project.link,
      project.status,
      project.userId,
      project.techStacks,
    );

    return result.success ? result.value : null;
  }

  async findByUserId(userId: string): Promise<Project[] | null> {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      include: { techStacks: true },
    });

    const result = projects.map((project) =>
      ProjectFactory.create(
        project.id,
        project.title,
        project.description,
        project.link,
        project.status,
        project.userId,
        project.techStacks,
      ),
    );

    // Filtrer les projets valides uniquement
    const validProjects = result
      .filter((res): res is Result<Project> & { success: true } => res.success)
      .map((res) => res.value);

    return validProjects.length > 0 ? validProjects : null;
  }
}
