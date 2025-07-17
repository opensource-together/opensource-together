import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '@/contexts/project/use-cases/ports/project.repository.port';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Project } from '@/contexts/project/domain/project.entity';
import { Result } from '@/libs/result';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaProjectMapper } from './prisma.project.mapper';

@Injectable()
export class PrismaProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(project: Project): Promise<Result<Project, string>> {
    try {
      const repoProject = PrismaProjectMapper.toRepo(project);
      if (!repoProject.success) return Result.fail(repoProject.error);

      const savedProject = await this.prisma.project.create({
        data: repoProject.value,
        include: {
          techStacks: true,
          categories: true,
          projectRoles: {
            include: {
              techStacks: true,
            },
          },
          projectMembers: true,
          keyFeatures: true,
          projectGoals: true,
          externalLinks: true,
        },
      });
      const domainProject = PrismaProjectMapper.toDomain(savedProject);
      if (!domainProject.success) {
        return Result.fail(
          typeof domainProject.error === 'string'
            ? domainProject.error
            : JSON.stringify(domainProject.error),
        );
      }
      return Result.ok(domainProject.value);
    } catch (error) {
      console.log('error', error);
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
      return Result.fail(`Unknown error during project creation`);
    }
  }

  async updateProjectById(
    id: string,
    payload: {
      title?: string;
      description?: string;
      shortDescription?: string;
      link?: string;
      techStacks?: { id: string }[];
    },
    ownerId: string,
  ): Promise<Result<Project>> {
    try {
      // Vérification des permissions
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: { projectRoles: true, externalLinks: true },
      });
      if (!project) return Result.fail('Project not found');
      if (project.ownerId !== ownerId)
        return Result.fail('You are not allowed to update this project');

      // Utilisation d'une transaction pour garantir l'atomicité
      return await this.prisma.$transaction(async (tx) => {
        // 1. Mise à jour des informations de base du projet
        await tx.project.update({
          where: { id },
          data: {
            title: payload.title,
            description: payload.description,
            shortDescription: payload.shortDescription,
          },
        });

        // 2. Mise à jour des techStacks si nécessaire
        if (payload.techStacks) {
          await tx.project.update({
            where: { id },
            data: {
              techStacks: {
                set: [], // On repart à zéro
                connect: payload.techStacks.map((ts) => ({ id: ts.id })),
              },
            },
          });
        }

        // 4. Récupération du projet final avec toutes ses relations
        const finalProject = await tx.project.findUnique({
          where: { id },
          include: {
            techStacks: true,
            projectRoles: {
              include: { techStacks: true },
            },
            projectMembers: true,
            categories: true,
            keyFeatures: true,
            projectGoals: true,
            externalLinks: true,
          },
        });

        if (!finalProject) return Result.fail('Project not found');
        const domainProject = PrismaProjectMapper.toDomain(finalProject);
        if (!domainProject.success) {
          return Result.fail(
            typeof domainProject.error === 'string'
              ? domainProject.error
              : JSON.stringify(domainProject.error),
          );
        }

        return Result.ok(domainProject.value);
      });
    } catch (error) {
      return Result.fail(`Unknown error: ${error}`);
    }
  }

  async deleteProjectById(
    id: string,
    ownerId: string,
  ): Promise<Result<boolean>> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
      });

      if (!project) return Result.fail('Project not found');

      if (project.ownerId !== ownerId) {
        return Result.fail('You are not allowed to delete this project');
      }

      await this.prisma.project.delete({
        where: { id },
      });

      return Result.ok(true);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return Result.fail('Project not found');
        }
      }
      return Result.fail(`Unknown error during project deletion: ${error}`);
    }
  }

  // async findProjectByFilters(
  //   filters: ProjectFilterInputsDto,
  // ): Promise<Result<Project[], string>> {
  //   try {
  //     // Construction dynamique du where clause
  //     const where: Prisma.ProjectWhereInput = {};

  //     // Filtre par titre
  //     if (filters.title && filters.title.trim() !== '') {
  //       where.title = {
  //         contains: filters.title,
  //         mode: 'insensitive',
  //       };
  //     }

  //     // Filtre par rôles
  //     if (filters.roles && filters.roles.length > 0) {
  //       where.projectRoles = {
  //         some: {
  //           title: {
  //             in: filters.roles,
  //             mode: 'insensitive',
  //           },
  //         },
  //       };
  //     }

  //     // Filtre par technologies
  //     if (filters.techStacks && filters.techStacks.length > 0) {
  //       where.techStacks = {
  //         some: {
  //           name: {
  //             in: filters.techStacks,
  //             mode: 'insensitive',
  //           },
  //         },
  //       };
  //     }

  //     // Configuration du tri
  //     const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
  //     orderBy.createdAt = filters.sortOrder;

  //     const prismaProjects = await this.prisma.project.findMany({
  //       where,
  //       orderBy,
  //       include: {
  //         techStacks: true,
  //         projectRoles: {
  //           include: { techStacks: true },
  //         },
  //         projectMembers: true,
  //         categories: true,
  //         keyFeatures: true,
  //         projectGoals: true,
  //         externalLinks: true,
  //       },
  //     });

  //     if (prismaProjects.length === 0) return Result.ok([]);

  //     const domainProjects: Project[] = [];

  //     for (const projectPrisma of prismaProjects) {
  //       const domainProject = PrismaProjectMapper.toDomain(projectPrisma);
  //       if (!domainProject.success) {
  //         return Result.fail(
  //           typeof domainProject.error === 'string'
  //             ? domainProject.error
  //             : JSON.stringify(domainProject.error),
  //         );
  //       }
  //       domainProjects.push(domainProject.value);
  //     }

  //     return Result.ok(domainProjects);
  //   } catch (error) {
  //     return Result.fail(`Unknown error : ${error}`);
  //   }
  // }

  async findById(id: string): Promise<Result<Project, string>> {
    try {
      const projectPrisma = await this.prisma.project.findUnique({
        where: { id },
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          projectMembers: true,
          categories: true,
          keyFeatures: true,
          projectGoals: true,
          externalLinks: true,
        },
      });

      if (!projectPrisma) return Result.fail('Project not found');

      const domainProject = PrismaProjectMapper.toDomain(projectPrisma);
      if (!domainProject.success) {
        return Result.fail(
          typeof domainProject.error === 'string'
            ? domainProject.error
            : JSON.stringify(domainProject.error),
        );
      }

      return Result.ok(domainProject.value);
    } catch (error) {
      return Result.fail(`Unknown error : ${error}`);
    }
  }

  async getAllProjects(): Promise<Result<Project[], string>> {
    try {
      const projectsPrisma = await this.prisma.project.findMany({
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          projectMembers: true,
          categories: true,
          keyFeatures: true,
          projectGoals: true,
          externalLinks: true,
        },
      });

      if (!projectsPrisma) return Result.ok([]);

      const domainProjects: Project[] = [];

      for (const projectPrisma of projectsPrisma) {
        const domainProject = PrismaProjectMapper.toDomain(projectPrisma);
        if (!domainProject.success) {
          return Result.fail(
            typeof domainProject.error === 'string'
              ? domainProject.error
              : JSON.stringify(domainProject.error),
          );
        }
        domainProjects.push(domainProject.value);
      }

      return Result.ok(domainProjects);
    } catch (error) {
      return Result.fail(`Unknown error : ${error}`);
    }
  }

  async findProjectsByUserId(
    userId: string,
  ): Promise<Result<Project[], string>> {
    try {
      const projectsPrisma = await this.prisma.project.findMany({
        where: {
          OR: [
            // Projets où l'utilisateur est propriétaire
            { ownerId: userId },
            // Projets où l'utilisateur est membre
            { projectMembers: { some: { userId } } },
          ],
        },
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          projectMembers: true,
          categories: true,
          keyFeatures: true,
          projectGoals: true,
          externalLinks: true,
        },
      });

      if (!projectsPrisma || projectsPrisma.length === 0) return Result.ok([]);

      const domainProjects: Project[] = [];

      for (const projectPrisma of projectsPrisma) {
        const domainProject = PrismaProjectMapper.toDomain(projectPrisma);
        if (!domainProject.success) {
          return Result.fail(
            typeof domainProject.error === 'string'
              ? domainProject.error
              : JSON.stringify(domainProject.error),
          );
        }
        domainProjects.push(domainProject.value);
      }

      return Result.ok(domainProjects);
    } catch (error) {
      return Result.fail(`Unknown error : ${error}`);
    }
  }

  async findByTitle(title: string): Promise<Result<Project, string>> {
    try {
      const projectPrisma = await this.prisma.project.findFirst({
        where: { title },
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          projectMembers: true,
          categories: true,
          keyFeatures: true,
          projectGoals: true,
          externalLinks: true,
        },
      });

      if (!projectPrisma) return Result.fail('Project not found');

      const domainProject = PrismaProjectMapper.toDomain(projectPrisma);
      if (!domainProject.success) {
        return Result.fail(
          typeof domainProject.error === 'string'
            ? domainProject.error
            : JSON.stringify(domainProject.error),
        );
      }

      return Result.ok(domainProject.value);
    } catch {
      return Result.fail(`Unknown error`);
    }
  }

  async delete(id: string): Promise<Result<boolean, string>> {
    try {
      await this.prisma.project.delete({
        where: { id },
      });

      return Result.ok(true);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === '') {
          return Result.fail('Project not found');
        }
      }
      return Result.fail(`Unknown error during project deletion: ${error}`);
    }
  }

  async update(id: string, project: Project): Promise<Result<Project, string>> {
    try {
      const projectData = project.toPrimitive();

      // Utilisation d'une transaction pour garantir l'atomicité
      return await this.prisma.$transaction(async (tx) => {
        // 1. Mise à jour des informations de base du projet
        await tx.project.update({
          where: { id },
          data: {
            title: projectData.title,
            description: projectData.description,
            shortDescription: projectData.shortDescription,
            externalLinks: {
              deleteMany: {},
              create:
                projectData.externalLinks
                  ?.filter((link) => link && link.url && link.type)
                  ?.map((link) => ({
                    type: link.type,
                    url: link.url,
                  })) || [],
            },
          },
        });

        // 2. Mise à jour des techStacks
        if (projectData.techStacks && projectData.techStacks.length > 0) {
          await tx.project.update({
            where: { id },
            data: {
              techStacks: {
                set: [], // On repart à zéro
                connect: projectData.techStacks.map((ts) => ({ id: ts.id })),
              },
            },
          });
        }

        // 3. Mise à jour des categories
        if (projectData.categories && projectData.categories.length > 0) {
          await tx.project.update({
            where: { id },
            data: {
              categories: {
                set: [], // On repart à zéro
                connect: projectData.categories.map((cat) => ({ id: cat.id })),
              },
            },
          });
        }

        // 4. Mise à jour des keyFeatures
        if (projectData.keyFeatures && projectData.keyFeatures.length > 0) {
          await tx.keyFeature.deleteMany({
            where: { projectId: id },
          });
          await tx.keyFeature.createMany({
            data: projectData.keyFeatures.map((feature) => ({
              projectId: id,
              feature: feature.feature,
            })),
          });
        }

        // 5. Mise à jour des projectGoals
        if (projectData.projectGoals && projectData.projectGoals.length > 0) {
          await tx.projectGoal.deleteMany({
            where: { projectId: id },
          });
          await tx.projectGoal.createMany({
            data: projectData.projectGoals.map((goal) => ({
              projectId: id,
              goal: goal.goal,
            })),
          });
        }

        // 6. Mise à jour des projectRoles
        if (projectData.projectRoles && projectData.projectRoles.length > 0) {
          // Supprimer tous les rôles existants
          await tx.projectRole.deleteMany({
            where: { projectId: id },
          });

          // Créer les nouveaux rôles
          for (const role of projectData.projectRoles) {
            await tx.projectRole.create({
              data: {
                projectId: id,
                title: role.title,
                description: role.description,
                isFilled: role.isFilled,
                techStacks: {
                  connect: role.techStacks.map((ts) => ({ id: ts.id })),
                },
              },
            });
          }
        }

        // 7. Récupération du projet final avec toutes ses relations
        const finalProject = await tx.project.findUnique({
          where: { id },
          include: {
            techStacks: true,
            projectRoles: {
              include: { techStacks: true },
            },
            projectMembers: true,
            categories: true,
            keyFeatures: true,
            projectGoals: true,
            externalLinks: true,
          },
        });

        if (!finalProject) return Result.fail('Project not found');

        const domainProject = PrismaProjectMapper.toDomain(finalProject);
        if (!domainProject.success) {
          return Result.fail(
            typeof domainProject.error === 'string'
              ? domainProject.error
              : JSON.stringify(domainProject.error),
          );
        }

        return Result.ok(domainProject.value);
      });
    } catch {
      return Result.fail(`Unknown error during project update`);
    }
  }
}
