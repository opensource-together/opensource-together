import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Result } from '@/libs/result';
import { PrismaService } from 'prisma/prisma.service';
import {
  Project as DomainProject,
  TechStack as DomainTechStack,
  ProjectRole as DomainProjectRole,
  Category as DomainCategory,
  ExternalLink as DomainExternalLink,
} from '../domain/project';
import {
  Category as PrismaCategory,
  ProjectRole as PrismaProjectRole,
  TechStack as PrismaTechStack,
  ProjectExternalLink as PrismaProjectExternalLink,
  ProjectExternalLink,
} from '@prisma/client';
import {
  CreateProjectData,
  ProjectRepository,
  ProjectRepositoryError,
  UpdateProjectData,
} from './project.repository.interface';

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectData: CreateProjectData,
  ): Promise<Result<DomainProject, string>> {
    try {
      const savedProject = await this.prisma.project.create({
        data: {
          ownerId: projectData.ownerId,
          title: projectData.title,
          description: projectData.description,
          image: projectData.image,
          coverImages: projectData.coverImages,
          readme: projectData.readme,
          techStacks: {
            connect: projectData.techStacks.map((tech) => ({ id: tech })),
          },
          categories: {
            connect: projectData.categories.map((cat) => ({ id: cat })),
          },
          projectRoles: {
            create: projectData.projectRoles?.map((role) => ({
              title: role.title,
              description: role.description,
              isFilled: false,
              techStacks: {
                connect: role.techStacks.map((tech) => ({ id: tech })),
              },
            })),
          },
          externalLinks: {
            create:
              projectData.externalLinks?.map((link) => ({
                type: link.type,
                url: link.url,
              })) || [],
          },
        },
        include: {
          techStacks: true,
          categories: true,
          projectRoles: {
            include: {
              techStacks: true,
            },
          },
          projectMembers: true,
          externalLinks: true,
          owner: true,
        },
      });

      return Result.ok({
        ownerId: savedProject.ownerId,
        title: savedProject.title,
        description: savedProject.description,
        image: savedProject.image || '',
        coverImages: savedProject.coverImages || [],
        readme: savedProject.readme || '',
        categories: savedProject.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        })),
        techStacks: savedProject.techStacks.map((tech) => ({
          id: tech.id,
          name: tech.name,
          iconUrl: tech.iconUrl,
          type: tech.type,
        })),
        projectRoles: savedProject.projectRoles.map((role) => ({
          id: role.id,
          title: role.title,
          description: role.description,
          techStacks: role.techStacks.map((tech) => ({
            id: tech.id,
            name: tech.name,
            iconUrl: tech.iconUrl,
            type: tech.type,
          })),
        })),
        externalLinks: savedProject.externalLinks.map((link) => ({
          id: link.id,
          type: link.type as 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'WEBSITE',
          url: link.url,
        })),
        createdAt: savedProject.createdAt,
        updatedAt: savedProject.updatedAt,
      });
    } catch (error) {
      console.log('error', error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return Result.fail<DomainProject, ProjectRepositoryError>(
            'DUPLICATE_PROJECT',
          );
        } else if (error.code === 'P2003') {
          return Result.fail<DomainProject, ProjectRepositoryError>(
            'VALIDATION_FAILED',
          );
        }
      }
      return Result.fail<DomainProject, ProjectRepositoryError>(
        'DATABASE_ERROR',
      );
    }
  }

  async findByTitle(title: string): Promise<Result<DomainProject, string>> {
    try {
      const project = await this.prisma.project.findFirst({
        where: { title },
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          projectMembers: true,
          categories: true,
          externalLinks: true,
          owner: true,
        },
      });

      if (!project) {
        return Result.fail<DomainProject, string>('PROJECT_NOT_FOUND');
      }

      return Result.ok({
        ownerId: project.ownerId,
        title: project.title,
        description: project.description,
        image: project.image || '',
        coverImages: project.coverImages || [],
        readme: project.readme || '',
        categories: project.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        })),
        techStacks: project.techStacks.map((tech) => ({
          id: tech.id,
          name: tech.name,
          iconUrl: tech.iconUrl,
          type: tech.type,
        })),
        projectRoles: project.projectRoles.map((role) => ({
          id: role.id,
          title: role.title,
          description: role.description,
          techStacks: role.techStacks.map((tech) => ({
            id: tech.id,
            name: tech.name,
            iconUrl: tech.iconUrl,
            type: tech.type,
          })),
        })),
        externalLinks: project.externalLinks.map((link) => ({
          id: link.id,
          type: link.type as 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'WEBSITE',
          url: link.url,
        })),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });
    } catch {
      return Result.fail<DomainProject, string>('DATABASE_ERROR');
    }
  }

  async findById(id: string): Promise<Result<DomainProject, string>> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          categories: true,
          externalLinks: true,
          owner: {
            select: {
              id: true,
              name: true,
              githubLogin: true,
              image: true,
            },
          },
          projectMembers: true,
          projectRoleApplication: {
            include: {
              user: true,
              projectRole: {
                include: { techStacks: true },
              },
            },
          },
        },
      });
      if (!project)
        return Result.fail<DomainProject, string>('PROJECT_NOT_FOUND');
      return Result.ok({
        id: project.id,
        owner: {
          id: project.owner.id,
          name: project.owner.name || '',
          githubLogin: project.owner.githubLogin || '',
          image: project.owner.image || '',
        },
        title: project.title,
        description: project.description,
        image: project.image || '',
        coverImages: project.coverImages || [],
        readme: project.readme || '',
        categories: project.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        })),
        techStacks: project.techStacks.map((tech) => ({
          id: tech.id,
          name: tech.name,
          iconUrl: tech.iconUrl,
          type: tech.type,
        })),
        projectRoles: project.projectRoles.map((role) => ({
          id: role.id,
          title: role.title,
          description: role.description,
          techStacks: role.techStacks.map((tech) => ({
            id: tech.id,
            name: tech.name,
            iconUrl: tech.iconUrl,
            type: tech.type,
          })),
        })),
        externalLinks: project.externalLinks.map((link) => ({
          id: link.id,
          type: link.type as 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'WEBSITE',
          url: link.url,
        })),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });
    } catch {
      return Result.fail<DomainProject, string>('DATABASE_ERROR');
    }
  }
  async findAll(): Promise<Result<DomainProject[], string>> {
    try {
      const results = await this.prisma.project.findMany({
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          projectMembers: true,
          categories: true,
          externalLinks: true,
          owner: {
            select: {
              id: true,
              name: true,
              githubLogin: true,
              image: true,
            },
          },
        },
        take: 25,
      });
      if (!results) return Result.ok([]);

      return Result.ok(
        results.map((project) => ({
          owner: {
            id: project.owner.id,
            name: project.owner.name || '',
            githubLogin: project.owner.githubLogin || '',
            image: project.owner.image || '',
          },
          title: project.title,
          description: project.description,
          image: project.image || '',
          coverImages: project.coverImages || [],
          readme: project.readme || '',
          categories: project.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
          })),
          techStacks: project.techStacks.map((tech) => ({
            id: tech.id,
            name: tech.name,
            iconUrl: tech.iconUrl,
            type: tech.type,
          })),
          projectRoles: project.projectRoles.map((role) => ({
            id: role.id,
            title: role.title,
            description: role.description,
            techStacks: role.techStacks.map((tech) => ({
              id: tech.id,
              name: tech.name,
              iconUrl: tech.iconUrl,
              type: tech.type,
            })),
          })),
          externalLinks: project.externalLinks.map((link) => ({
            id: link.id,
            type: link.type as 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'WEBSITE',
            url: link.url,
          })),
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })),
      );
    } catch {
      return Result.fail<DomainProject[], string>('DATABASE_ERROR');
    }
  }

  // async update(
  //   projectId: string,
  //   data: UpdateProjectData,
  // ): Promise<Result<DomainProject, string>> {
  //   try {
  //     const updatedProject = await this.prisma.project.update({
  //       where: {
  //         id: projectId,
  //       },
  //       data: {
  //         title: data.title,
  //         description: data.description,
  //         image: data.image,
  //         coverImages: data.coverImages,
  //         readme: data.readme,
  //         externalLinks: {
  //           create:
  //             data.externalLinks?.map((link) => ({
  //               type: link.type,
  //               url: link.url,
  //             })) || [],
  //         },
  //         techStacks: {
  //           connect: data.techStacks?.map((tech) => ({ id: tech })) || [],
  //         },
  //         categories: {
  //           connect: data.categories?.map((cat) => ({ id: cat })) || [],
  //         },
  //       },
  //       include: {
  //         techStacks: true,
  //         categories: true,
  //         externalLinks: true,
  //         projectRoles: true,
  //         projectMembers: true,
  //         owner: true,
  //         projectRoleApplication: true,
  //       },
  //     });
  //     return Result.ok({
  //       ...updatedProject,
  //       image: updatedProject.image || '',
  //       coverImages: updatedProject.coverImages || [],
  //       readme: updatedProject.readme || '',
  //       categories: updatedProject.categories.map((cat) => ({
  //         id: cat.id,
  //         name: cat.name,
  //       })),
  //       techStacks: updatedProject.techStacks.map((tech) => ({
  //         id: tech.id,
  //         name: tech.name,
  //         iconUrl: tech.iconUrl,
  //         type: tech.type,
  //       })),
  //       projectRoles: updatedProject.projectRoles.map((role) => ({
  //         id: role.id,
  //         title: role.title,
  //         description: role.description,
  //         techStacks: role.techStacks.map((tech) => ({
  //           id: tech.id,
  //           name: tech.name,
  //           iconUrl: tech.iconUrl,
  //           type: tech.type,
  //         })),
  //       })),
  //       externalLinks: updatedProject.externalLinks.map((link) => ({
  //         id: link.id,
  //         type: link.type as 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'WEBSITE',
  //         url: link.url,
  //       })),
  //       createdAt: updatedProject.createdAt,
  //       updatedAt: updatedProject.updatedAt,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return Result.fail<DomainProject, ProjectRepositoryError>(
  //       'DATABASE_ERROR',
  //     );
  //   }
  // }
  async update(
    id: string,
    project: UpdateProjectData,
  ): Promise<Result<DomainProject, string>> {
    try {
      const projectData = project;

      // Utilisation d'une transaction pour garantir l'atomicité
      return await this.prisma.$transaction(async (tx) => {
        // 1. Mise à jour des informations de base du projet
        await tx.project.update({
          where: { id },
          include: {
            externalLinks: true,
          },
          data: {
            title: projectData.title,
            description: projectData.description,
            image: projectData.image,
            coverImages: projectData.coverImages,
            readme: projectData.readme,
            // externalLinks: {
            //   deleteMany: {},
            //   create:
            //     projectData.externalLinks
            //       ?.filter((link) => link && link.url && link.type)
            //       ?.map((link) => ({
            //         type: link.type,
            //         url: link.url,
            //       })) || [],
            // },
          },
        });

        // 2. Mise à jour des techStacks (remplacement total si fourni)
        if (projectData.techStacks !== undefined) {
          const techIds = Array.from(new Set(projectData.techStacks || []));
          await tx.project.update({
            where: { id },
            data: {
              techStacks: {
                set: techIds.map((techId) => ({ id: techId })),
              },
            },
          });
        }

        // 3. Mise à jour des categories (remplacement total si fourni)
        if (projectData.categories !== undefined) {
          const catIds = Array.from(new Set(projectData.categories || []));
          await tx.project.update({
            where: { id },
            data: {
              categories: {
                set: catIds.map((catId) => ({ id: catId })),
              },
            },
          });
        }
        // 4. Mise à jour des externalLinks (upsert par id, création des nouveaux, suppression des retirés)
        if (projectData.externalLinks !== undefined) {
          const withId = projectData.externalLinks.filter(
            (l) => !!l.id,
          ) as Array<{
            id: string;
            type: string;
            url: string;
          }>;
          const withoutId = projectData.externalLinks.filter(
            (l) => !l.id,
          ) as Array<{
            id: string;
            type: string;
            url: string;
          }>;

          console.log('withId', withId);
          console.log('withoutId', withoutId);
          await tx.project.update({
            where: { id },
            data: {
              externalLinks: {
                deleteMany: withId.length
                  ? { id: { notIn: withId.map((l) => l.id) } }
                  : {},

                // Met à jour ceux qui existent (ou les crée si l'id n'existe plus)
                upsert: withId.map((l) => ({
                  where: { id: l.id },
                  update: {
                    type: l.type,
                    url: l.url,
                  },
                  create: {
                    type: l.type,
                    url: l.url,
                  },
                })),

                // Crée les nouveaux (sans id)
                create: withoutId.map((l) => ({
                  type: l.type,
                  url: l.url,
                })),
              },
            },
          });
        }

        const finalProject = await tx.project.findUnique({
          where: { id },
          include: {
            techStacks: true,
            projectRoles: {
              include: { techStacks: true },
            },
            projectMembers: true,
            categories: true,
            externalLinks: true,
            owner: true,
          },
        });

        if (!finalProject) return Result.fail('Project not found');

        const domainProject = {
          id: finalProject.id,
          ownerId: finalProject.ownerId,
          title: finalProject.title,
          description: finalProject.description,
          image: finalProject.image || '',
          coverImages: finalProject.coverImages || [],
          readme: finalProject.readme || '',
          categories: finalProject.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
          })),
          techStacks: finalProject.techStacks.map((tech) => ({
            id: tech.id,
            name: tech.name,
            iconUrl: tech.iconUrl,
            type: tech.type,
          })),
          projectRoles: finalProject.projectRoles.map((role) => ({
            id: role.id,
            title: role.title,
            description: role.description,
            techStacks: role.techStacks.map((tech) => ({
              id: tech.id,
              name: tech.name,
              iconUrl: tech.iconUrl,
              type: tech.type,
            })),
          })),
          externalLinks: finalProject.externalLinks.map((link) => ({
            id: link.id,
            type: link.type as 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'WEBSITE',
            url: link.url,
          })),
          createdAt: finalProject.createdAt,
          updatedAt: finalProject.updatedAt,
        };

        return Result.ok(domainProject);
      });
    } catch (error) {
      console.log('error', error);
      return Result.fail(`Unknown error during project update`);
    }
  }

  mapTechStackToPrisma(techStack: DomainTechStack): PrismaTechStack {
    return {
      id: techStack.id,
      name: techStack.name,
      iconUrl: techStack.iconUrl,
      type: techStack.type,
    };
  }

  mapProjectRoleToPrisma(
    projectRole: DomainProjectRole,
  ): Omit<PrismaProjectRole, 'projectId' | 'id'> {
    return {
      title: projectRole.title,
      description: projectRole.description,
      isFilled: false,
      createdAt: projectRole.createdAt || new Date(),
      updatedAt: projectRole.updatedAt || new Date(),
    };
  }

  mapCategoryToPrisma(category: DomainCategory): PrismaCategory {
    return {
      id: category.id,
      name: category.name,
    };
  }

  mapExternalLinkToPrisma(
    externalLink: DomainExternalLink & { projectId: string },
  ): PrismaProjectExternalLink {
    return {
      projectId: externalLink.projectId,
      id: externalLink.id || '',
      type: externalLink.type as ProjectExternalLink['type'],
      url: externalLink.url,
    };
  }
}
