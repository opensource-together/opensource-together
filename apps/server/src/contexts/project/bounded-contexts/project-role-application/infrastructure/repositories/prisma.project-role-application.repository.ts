import { Logger } from '@nestjs/common';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { ProjectRoleApplicationRepositoryPort } from '../../use-cases/ports/project-role-application.repository.port';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';
import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { PrismaProjectRoleApplicationMapper } from './prisma.project-role-application.mapper';

@Injectable()
export class PrismaProjectRoleApplicationRepository
  implements ProjectRoleApplicationRepositoryPort
{
  private readonly Logger = new Logger(
    PrismaProjectRoleApplicationRepository.name,
  );
  constructor(private readonly prisma: PrismaService) {}

  async create(
    application: ProjectRoleApplication,
  ): Promise<Result<ProjectRoleApplication, string>> {
    try {
      const toRepo = PrismaProjectRoleApplicationMapper.toRepo(application);
      if (!toRepo.success) {
        return Result.fail(
          typeof toRepo.error === 'string'
            ? toRepo.error
            : 'Erreur de validation',
        );
      }

      const created = await this.prisma.projectRoleApplication.create({
        data: toRepo.value,
        include: {
          user: true,
          projectRole: true,
          project: {
            include: {
              keyFeatures: true,
              projectGoals: true,
            },
          },
        },
      });

      const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
        ...created,
        project: {
          ...created.project,
          owner: {
            id: created.project.ownerId || 'unknown',
            username: 'unknown',
            login: 'unknown',
            email: 'unknown',
            provider: 'unknown',
            jobTitle: null,
            location: null,
            company: null,
            bio: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatarUrl: null,
          },
        },
      });
      if (!domainApplication.success) {
        return Result.fail(
          typeof domainApplication.error === 'string'
            ? domainApplication.error
            : 'Erreur de conversion',
        );
      }

      return Result.ok(domainApplication.value);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail('Une erreur est survenue');
    }
  }

  async existsStatusApplication(
    userId: string,
    projectRoleId: string,
  ): Promise<Result<string | undefined, string>> {
    try {
      const projectRoleApplication =
        await this.prisma.projectRoleApplication.findFirst({
          where: {
            userId: userId,
            projectRoleId,
            status: {
              in: ['PENDING', 'REJECTED'],
            },
          },
        });

      if (!projectRoleApplication) {
        return Result.ok(undefined);
      }
      return Result.ok(projectRoleApplication.status);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail('Une erreur est survenue');
    }
  }

  async findAllByProjectId(projectId: string): Promise<
    Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        project: {
          id: string;
          title: string;
          shortDescription: string;
          image?: string;
          owner: {
            id: string;
            username: string;
            login: string;
            email: string;
            provider: string;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string;
          };
        };
        projectRole: {
          id: string;
          projectId?: string;
          title: string;
          description: string;
          techStacks: {
            id: string;
            name: string;
            iconUrl?: string;
          }[];
          roleCount?: number;
          projectGoal?: {
            id?: string;
            projectId?: string;
            goal: string;
          }[];
        };
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
        selectedKeyFeatures: {
          feature: string;
        }[];
        selectedProjectGoals: {
          goal: string;
        }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy?: string;
        rejectionReason?: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl?: string;
        };
      }[],
      string
    >
  > {
    try {
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { projectId: { equals: projectId } },
        include: {
          user: true,
          projectRole: {
            include: {
              techStacks: true,
            },
          },
          project: {
            include: {
              keyFeatures: true,
              projectGoals: true,
              owner: true,
            },
          },
        },
      });
      if (!applications) {
        return Result.ok([]);
      }

      const projectRoleApplications: {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        project: {
          id: string;
          title: string;
          shortDescription: string;
          image?: string;
          owner: {
            id: string;
            username: string;
            login: string;
            email: string;
            provider: string;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string;
          };
        };
        projectRole: {
          id: string;
          projectId?: string;
          title: string;
          description: string;
          techStacks: {
            id: string;
            name: string;
            iconUrl?: string;
          }[];
          roleCount?: number;
          projectGoal?: {
            id?: string;
            projectId?: string;
            goal: string;
          }[];
        };
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
        selectedKeyFeatures: {
          feature: string;
        }[];
        selectedProjectGoals: {
          goal: string;
        }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy?: string;
        rejectionReason?: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl?: string;
        };
      }[] = [];

      for (const application of applications) {
        const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
          ...application,
          project: {
            ...application.project,
            keyFeatures: application.project.keyFeatures,
            projectGoals: application.project.projectGoals,
          },
          user: {
            ...application.user,
            username: application.user.username,
          },
        });
        if (!domainApplication.success) {
          return Result.fail(
            'Une erreur est survenue lors de la récupération des candidatures',
          );
        }

        // Mapper les techStacks du projectRole
        const techStacks = application.projectRole.techStacks.map((ts) => ({
          id: ts.id,
          name: ts.name,
          iconUrl: ts.iconUrl,
        }));

        projectRoleApplications.push({
          appplicationId: domainApplication.value.id!,
          projectRoleId: domainApplication.value.projectRoleId,
          projectRoleTitle: application.projectRole.title,
          project: {
            id: application.project.id,
            title: application.project.title,
            shortDescription: application.project.shortDescription,
            image: application.project.image || undefined,
            owner: {
              id:
                application.project.owner?.id ||
                application.project.ownerId ||
                'Unknown',
              username: application.project.owner?.username || 'Unknown',
              login: application.project.owner?.login || 'Unknown',
              email: application.project.owner?.email || 'Unknown',
              provider: application.project.owner?.provider || 'Unknown',
              createdAt: application.project.owner?.createdAt || new Date(),
              updatedAt: application.project.owner?.updatedAt || new Date(),
              avatarUrl: application.project.owner?.avatarUrl || 'Unknown',
            },
          },
          projectRole: {
            id: application.projectRole.id,
            projectId: application.projectRole.projectId,
            title: application.projectRole.title,
            description: application.projectRole.description,
            techStacks,
            roleCount: undefined, // À implémenter si nécessaire
            projectGoal: undefined, // À implémenter si nécessaire
          },
          status: domainApplication.value.status as
            | 'PENDING'
            | 'ACCEPTED'
            | 'REJECTED'
            | 'CANCELLED',
          selectedKeyFeatures: domainApplication.value.selectedKeyFeatures.map(
            (kf) => ({
              feature: kf.toPrimitive().feature,
            }),
          ),
          selectedProjectGoals:
            domainApplication.value.selectedProjectGoals.map((pg) => ({
              goal: pg.toPrimitive().goal,
            })),
          appliedAt: domainApplication.value.appliedAt,
          decidedAt: domainApplication.value.decidedAt || new Date(),
          decidedBy: domainApplication.value.decidedBy || undefined,
          rejectionReason: domainApplication.value.rejectionReason || undefined,
          motivationLetter: domainApplication.value.motivationLetter || '',
          userProfile: {
            id: domainApplication.value.userProfile.id,
            name: domainApplication.value.userProfile.username,
            avatarUrl:
              domainApplication.value.userProfile.avatarUrl || undefined,
          },
        });
      }

      return Result.ok(projectRoleApplications);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        'Une erreur est survenue lors de la récupération des candidatures',
      );
    }
  }

  async findByRoleId(roleId: string): Promise<
    Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: { id: string; feature: string }[];
        selectedProjectGoals: { id: string; goal: string }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        motivationLetter: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          username: string;
          avatarUrl: string;
        };
      }[],
      string
    >
  > {
    try {
      this.Logger.log('roleId findByRoleId', roleId);
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { projectRoleId: String(roleId) },
        include: {
          user: true,
          projectRole: true,
          project: {
            include: {
              keyFeatures: true,
              projectGoals: true,
            },
          },
        },
      });
      this.Logger.log('applications findByRoleId', applications);
      if (!applications) {
        return Result.ok([]);
      }

      const projectRoleApplications: {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: { id: string; feature: string }[];
        selectedProjectGoals: { id: string; goal: string }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        motivationLetter: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          username: string;
          avatarUrl: string;
        };
      }[] = [];

      for (const application of applications) {
        const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
          ...application,
          project: {
            ...application.project,
            owner: {
              id: application.project.ownerId || 'unknown',
              username: 'unknown',
              login: 'unknown',
              email: 'unknown',
              provider: 'unknown',
              jobTitle: null,
              location: null,
              company: null,
              bio: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              avatarUrl: null,
            },
          },
        });
        if (!domainApplication.success) {
          return Result.fail(
            'Une erreur est survenue lors de la récupération des candidatures',
          );
        }
        projectRoleApplications.push({
          appplicationId: domainApplication.value.id!,
          projectRoleId: domainApplication.value.projectRoleId,
          projectRoleTitle: application.projectRole.title, // Utilise le titre actuel du role
          projectRoleDescription: application.projectRole.description, // Ajoute la description actuelle du role
          status: domainApplication.value.status,
          selectedKeyFeatures: domainApplication.value.selectedKeyFeatures.map(
            (kf) => ({
              id: kf.toPrimitive().id!,
              feature: kf.toPrimitive().feature,
            }),
          ),
          selectedProjectGoals:
            domainApplication.value.selectedProjectGoals.map((pg) => ({
              id: pg.toPrimitive().id!,
              goal: pg.toPrimitive().goal,
            })),
          appliedAt: domainApplication.value.appliedAt,
          decidedAt: domainApplication.value.decidedAt || new Date(),
          decidedBy: domainApplication.value.decidedBy || '',
          motivationLetter: domainApplication.value.motivationLetter || '',
          rejectionReason: domainApplication.value.rejectionReason || '',
          userProfile: {
            id: domainApplication.value.userProfile.id,
            username: domainApplication.value.userProfile.username,
            avatarUrl: domainApplication.value.userProfile.avatarUrl || '',
          },
        });
      }
      this.Logger.log(
        'projectRoleApplications findByRoleId',
        projectRoleApplications,
      );
      return Result.ok(projectRoleApplications);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        'Une erreur est survenue lors de la récupération des candidatures',
      );
    }
  }

  async rejectApplication(props: {
    applicationId: string;
    rejectionReason: string;
  }): Promise<Result<ProjectRoleApplication, string>> {
    try {
      const application = await this.prisma.projectRoleApplication.update({
        where: { id: props.applicationId },
        data: {
          status: 'REJECTED',
          rejectionReason: props.rejectionReason,
        },
        include: {
          projectRole: true,
          project: {
            include: {
              keyFeatures: true,
              projectGoals: true,
            },
          },
          user: true,
        },
      });
      if (!application) return Result.fail('Application not found');

      const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
        ...application,
        projectRole: application.projectRole,
        project: {
          ...application.project,
          owner: {
            id: application.project.ownerId || 'unknown',
            username: 'unknown',
            login: 'unknown',
            email: 'unknown',
            provider: 'unknown',
            jobTitle: null,
            location: null,
            company: null,
            bio: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatarUrl: null,
          },
        },
        user: application.user,
      });
      if (!domainApplication.success) {
        return Result.fail(
          'Une erreur est survenue lors de la récupération de la candidature',
        );
      }

      return Result.ok(domainApplication.value);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        'Une erreur est survenue lors de la récupération de la candidature',
      );
    }
  }

  async acceptApplication(props: {
    applicationId: string;
    projectId: string;
    userId: string;
  }): Promise<Result<ProjectRoleApplication, string>> {
    try {
      const application = await this.prisma.projectRoleApplication.update({
        where: { id: props.applicationId },
        data: {
          status: 'ACCEPTED',
        },
        include: {
          projectRole: true,
          project: {
            include: {
              keyFeatures: true,
              projectGoals: true,
            },
          },
          user: true,
        },
      });
      if (!application) return Result.fail('Application not found');

      const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
        ...application,
        projectRole: application.projectRole,
        project: {
          ...application.project,
          owner: {
            id: application.project.ownerId || 'unknown',
            username: 'unknown',
            login: 'unknown',
            email: 'unknown',
            provider: 'unknown',
            jobTitle: null,
            location: null,
            company: null,
            bio: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatarUrl: null,
          },
        },
        user: application.user,
      });
      this.Logger.log('domainApplication acceptApplication', domainApplication);
      if (!domainApplication.success) {
        return Result.fail(
          'Une erreur est survenue lors de la récupération de la candidature',
        );
      }

      return Result.ok(domainApplication.value);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        'Une erreur est survenue lors de la récupération de la candidature',
      );
    }
  }
  async findAllByUserId(userId: string): Promise<
    Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        project: {
          id: string;
          title: string;
          shortDescription: string;
          image?: string;
          owner: {
            id: string;
            username: string;
            login: string;
            email: string;
            provider: string;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string;
          };
        };
        projectRole: {
          id: string;
          projectId?: string;
          title: string;
          description: string;
          techStacks: {
            id: string;
            name: string;
            iconUrl?: string;
          }[];
          roleCount?: number;
          projectGoal?: {
            id?: string;
            projectId?: string;
            goal: string;
          }[];
        };
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
        selectedKeyFeatures: {
          feature: string;
        }[];
        selectedProjectGoals: {
          goal: string;
        }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy?: string;
        rejectionReason?: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl?: string;
        };
      }[],
      string
    >
  > {
    try {
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { userId: { equals: userId } },
        include: {
          projectRole: {
            include: {
              techStacks: true,
            },
          },
          project: {
            include: {
              keyFeatures: true,
              projectGoals: true,
              owner: true,
            },
          },
          user: true,
        },
      });
      if (!applications) {
        return Result.ok([]);
      }

      const projectRoleApplications: {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        project: {
          id: string;
          title: string;
          shortDescription: string;
          image?: string;
          owner: {
            id: string;
            username: string;
            login: string;
            email: string;
            provider: string;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string;
          };
        };
        projectRole: {
          id: string;
          projectId?: string;
          title: string;
          description: string;
          techStacks: {
            id: string;
            name: string;
            iconUrl?: string;
          }[];
          roleCount?: number;
          projectGoal?: {
            id?: string;
            projectId?: string;
            goal: string;
          }[];
        };
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
        selectedKeyFeatures: {
          feature: string;
        }[];
        selectedProjectGoals: {
          goal: string;
        }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy?: string;
        rejectionReason?: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl?: string;
        };
      }[] = [];

      for (const application of applications) {
        const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
          ...application,
          project: {
            ...application.project,
            keyFeatures: application.project.keyFeatures,
            projectGoals: application.project.projectGoals,
          },
          user: {
            ...application.user,
            username: application.user.username,
          },
        });
        if (!domainApplication.success) {
          return Result.fail(
            'Une erreur est survenue lors de la récupération des candidatures',
          );
        }

        // Mapper les techStacks du projectRole
        const techStacks = application.projectRole.techStacks.map((ts) => ({
          id: ts.id,
          name: ts.name,
          iconUrl: ts.iconUrl,
        }));

        projectRoleApplications.push({
          appplicationId: domainApplication.value.id!,
          projectRoleId: domainApplication.value.projectRoleId,
          projectRoleTitle: application.projectRole.title,
          project: {
            id: application.project.id,
            title: application.project.title,
            shortDescription: application.project.shortDescription,
            image: application.project.image || undefined,
            owner: {
              id:
                application.project.owner?.id ||
                application.project.ownerId ||
                'Unknown',
              username: application.project.owner?.username || 'Unknown',
              login: application.project.owner?.login || 'Unknown',
              email: application.project.owner?.email || 'Unknown',
              provider: application.project.owner?.provider || 'Unknown',
              createdAt: application.project.owner?.createdAt || new Date(),
              updatedAt: application.project.owner?.updatedAt || new Date(),
              avatarUrl: application.project.owner?.avatarUrl || 'Unknown',
            },
          },
          projectRole: {
            id: application.projectRole.id,
            projectId: application.projectRole.projectId,
            title: application.projectRole.title,
            description: application.projectRole.description,
            techStacks,
            roleCount: undefined, // À implémenter si nécessaire
            projectGoal: undefined, // À implémenter si nécessaire
          },
          status: domainApplication.value.status as
            | 'PENDING'
            | 'ACCEPTED'
            | 'REJECTED'
            | 'CANCELLED',
          selectedKeyFeatures: domainApplication.value.selectedKeyFeatures.map(
            (kf) => ({
              feature: kf.toPrimitive().feature,
            }),
          ),
          selectedProjectGoals:
            domainApplication.value.selectedProjectGoals.map((pg) => ({
              goal: pg.toPrimitive().goal,
            })),
          appliedAt: domainApplication.value.appliedAt,
          decidedAt: domainApplication.value.decidedAt || new Date(),
          decidedBy: domainApplication.value.decidedBy || undefined,
          rejectionReason: domainApplication.value.rejectionReason || undefined,
          motivationLetter: domainApplication.value.motivationLetter || '',
          userProfile: {
            id: domainApplication.value.userProfile.id,
            name: domainApplication.value.userProfile.username,
            avatarUrl:
              domainApplication.value.userProfile.avatarUrl || undefined,
          },
        });
      }

      return Result.ok(projectRoleApplications);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        'Une erreur est survenue lors de la récupération des candidatures',
      );
    }
  }

  async findById(id: string): Promise<Result<ProjectRoleApplication, string>> {
    try {
      const application = await this.prisma.projectRoleApplication.findUnique({
        where: { id },
        include: {
          projectRole: true,
          project: {
            include: {
              keyFeatures: true,
              projectGoals: true,
              owner: true,
            },
          },
          user: true,
        },
      });
      if (!application) {
        return Result.fail('Application not found');
      }
      const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
        ...application,
        projectRole: application.projectRole,
        project: {
          ...application.project,
          keyFeatures: application.project.keyFeatures,
          projectGoals: application.project.projectGoals,
          owner: application.project.owner,
        },
        user: application.user,
      });
      console.log('domainApplication', domainApplication);
      if (!domainApplication.success) {
        return Result.fail(
          typeof domainApplication.error === 'string'
            ? domainApplication.error
            : 'Une erreur est survenue lors de la récupération de la candidature',
        );
      }
      return Result.ok(domainApplication.value);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        'Une erreur est survenue lors de la récupération de la candidature',
      );
    }
  }
}
