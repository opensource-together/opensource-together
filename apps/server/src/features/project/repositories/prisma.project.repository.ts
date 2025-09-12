import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import {
  Category as PrismaCategory,
  ProjectExternalLink as PrismaProjectExternalLink,
  ProjectRole as PrismaProjectRole,
  TechStack as PrismaTechStack,
  ProjectExternalLink,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';
import {
  Category as DomainCategory,
  ExternalLink as DomainExternalLink,
  Project as DomainProject,
  ProjectRole as DomainProjectRole,
  TechStack as DomainTechStack,
  ProjectSummary,
} from '../domain/project';
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
          keyFeature: {
            create: projectData.keyFeatures.map((feat) => ({
              feature: feat.feature,
            })),
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
          keyFeature: true,
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
        id: savedProject.id,
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
        keyFeatures: savedProject.keyFeature.map((feature) => ({
          id: feature.id,
          projectId: feature.projectId,
          feature: feature.feature,
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
          type: link.type as
            | 'GITHUB'
            | 'TWITTER'
            | 'LINKEDIN'
            | 'DISCORD'
            | 'WEBSITE'
            | 'OTHER',
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
          keyFeature: true,
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
        keyFeatures: project.keyFeature.map((feature) => ({
          id: feature.id,
          projectId: feature.projectId,
          feature: feature.feature,
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
          type: link.type as
            | 'GITHUB'
            | 'TWITTER'
            | 'LINKEDIN'
            | 'DISCORD'
            | 'WEBSITE'
            | 'OTHER',
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
          keyFeature: true,
          owner: {
            select: {
              id: true,
              name: true,
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
          username: project.owner.name || '',
          avatarUrl: project.owner.image || '',
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
        keyFeatures: project.keyFeature.map((feature) => ({
          id: feature.id,
          projectId: feature.projectId,
          feature: feature.feature,
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
          type: link.type as
            | 'GITHUB'
            | 'TWITTER'
            | 'LINKEDIN'
            | 'DISCORD'
            | 'WEBSITE'
            | 'OTHER',
          url: link.url,
        })),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });
    } catch {
      return Result.fail<DomainProject, string>('DATABASE_ERROR');
    }
  }
  async findAll(): Promise<Result<ProjectSummary[], string>> {
    try {
      const results = await this.prisma.project.findMany({
        include: {
          techStacks: true,
          projectMembers: true,
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        take: 25,
      });
      if (!results) return Result.ok([]);

      return Result.ok(
        results.map((project) => ({
          id: project.id,
          owner: {
            id: project.owner.id,
            username: project.owner.name || '',
            avatarUrl: project.owner.image || '',
          },
          title: project.title,
          description: project.description,
          image: project.image || '',
          techStacks: project.techStacks.map((tech) => ({
            id: tech.id,
            name: tech.name,
            iconUrl: tech.iconUrl,
            type: tech.type,
          })),
          teamMembers: project.projectMembers?.map((member) => ({
            id: member.id,
            projectId: member.projectId,
            userId: member.userId,
            joinedAt: member.joinedAt,
          })),
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })),
      );
    } catch {
      return Result.fail<ProjectSummary[], string>('DATABASE_ERROR');
    }
  }

  async findByUserId(userId: string): Promise<Result<DomainProject[], string>> {
    try {
      const results = await this.prisma.project.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          projectMembers: true,
          categories: true,
          keyFeature: true,
          externalLinks: true,
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        take: 25,
      });
      if (!results) return Result.ok([]);

      return Result.ok(
        results.map((project) => ({
          id: project.id,
          owner: {
            id: project.owner.id,
            username: project.owner.name || '',
            avatarUrl: project.owner.image || '',
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
          keyFeatures: project.keyFeature.map((feature) => ({
            id: feature.id,
            projectId: feature.projectId,
            feature: feature.feature,
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
            type: link.type as
              | 'GITHUB'
              | 'TWITTER'
              | 'LINKEDIN'
              | 'DISCORD'
              | 'WEBSITE'
              | 'OTHER',
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

  async update(
    id: string,
    project: UpdateProjectData,
  ): Promise<Result<DomainProject, string>> {
    try {
      const projectData = project;

      return await this.prisma.$transaction(async (tx) => {
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
          },
        });

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

        if (projectData.keyFeatures !== undefined) {
          await tx.keyFeature.deleteMany({
            where: { projectId: id },
          });

          if (projectData.keyFeatures.length > 0) {
            await tx.keyFeature.createMany({
              data: projectData.keyFeatures.map((keyFeature) => ({
                projectId: keyFeature.projectId,
                feature: keyFeature.feature,
              })),
            });
          }
        }

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
            keyFeature: true,
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
          keyFeatures: finalProject.keyFeature.map((feature) => ({
            id: feature.id,
            projectId: feature.projectId,
            feature: feature.feature,
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
            type: link.type as
              | 'GITHUB'
              | 'TWITTER'
              | 'LINKEDIN'
              | 'DISCORD'
              | 'WEBSITE'
              | 'OTHER',
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

  async delete(
    userId: string,
    projectId: string,
  ): Promise<Result<boolean, string>> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project) return Result.fail('Project not found');
      if (project.ownerId !== userId) return Result.fail('Unauthorized');
      const deletedProject = await this.prisma.project.delete({
        where: { id: projectId },
      });
      if (!deletedProject) return Result.fail('Project not found');
      return Result.ok(true);
    } catch (error) {
      console.log('error', error);
      return Result.fail(`Unknown error during project deletion`);
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

  async findByRoleId(roleId: string): Promise<Result<DomainProject, string>> {
    try {
      const project = await this.prisma.project.findFirst({
        where: { projectRoles: { some: { id: roleId } } },
        include: {
          techStacks: true,
          projectRoles: {
            include: { techStacks: true },
          },
          categories: true,
          externalLinks: true,
          keyFeature: true,
          owner: {
            select: {
              id: true,
              name: true,
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
          username: project.owner.name || '',
          avatarUrl: project.owner.image || '',
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
        keyFeatures: project.keyFeature.map((feature) => ({
          id: feature.id,
          projectId: feature.projectId,
          feature: feature.feature,
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
          type: link.type as
            | 'GITHUB'
            | 'TWITTER'
            | 'LINKEDIN'
            | 'DISCORD'
            | 'WEBSITE'
            | 'OTHER',
          url: link.url,
        })),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });
    } catch {
      return Result.fail<DomainProject, string>('DATABASE_ERROR');
    }
  }
}
