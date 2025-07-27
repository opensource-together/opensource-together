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
          profile: {
            include: {
              user: true,
            },
          },
          projectRole: true,
          project: true,
        },
      });

      const domainApplication =
        PrismaProjectRoleApplicationMapper.toDomain(created);
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
            profileId: userId,
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
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl: string;
        };
      }[],
      string
    >
  > {
    try {
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { projectId: { equals: projectId } },
        include: {
          profile: {
            include: {
              user: true,
            },
          },
          projectRole: true,
          project: true,
        },
      });
      if (!applications) {
        return Result.ok([]);
      }

      const projectRoleApplications: {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl: string;
        };
      }[] = [];

      for (const application of applications) {
        const domainApplication =
          PrismaProjectRoleApplicationMapper.toDomain(application);
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
          selectedKeyFeatures: domainApplication.value.selectedKeyFeatures,
          selectedProjectGoals: domainApplication.value.selectedProjectGoals,
          appliedAt: domainApplication.value.appliedAt,
          decidedAt: domainApplication.value.decidedAt || new Date(),
          decidedBy: domainApplication.value.decidedBy || '',
          rejectionReason: domainApplication.value.rejectionReason || '',
          motivationLetter: domainApplication.value.motivationLetter || '',
          userProfile: {
            id: domainApplication.value.userProfile.id,
            name: domainApplication.value.userProfile.name,
            avatarUrl: domainApplication.value.userProfile.avatarUrl || '',
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
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        motivationLetter: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          name: string;
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
          profile: {
            include: {
              user: true,
            },
          },
          projectRole: true,
          project: true,
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
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        motivationLetter: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl: string;
        };
      }[] = [];

      for (const application of applications) {
        const domainApplication =
          PrismaProjectRoleApplicationMapper.toDomain(application);
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
          selectedKeyFeatures: domainApplication.value.selectedKeyFeatures,
          selectedProjectGoals: domainApplication.value.selectedProjectGoals,
          appliedAt: domainApplication.value.appliedAt,
          decidedAt: domainApplication.value.decidedAt || new Date(),
          decidedBy: domainApplication.value.decidedBy || '',
          motivationLetter: domainApplication.value.motivationLetter || '',
          rejectionReason: domainApplication.value.rejectionReason || '',
          userProfile: {
            id: domainApplication.value.userProfile.id,
            name: domainApplication.value.userProfile.name,
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
          project: true,
          profile: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!application) return Result.fail('Application not found');

      const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
        ...application,
        projectRole: application.projectRole,
        project: application.project,
        profile: {
          ...application.profile,
          user: application.profile.user,
        },
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
          status: 'APPROVAL',
        },
        include: {
          projectRole: true,
          project: true,
          profile: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!application) return Result.fail('Application not found');

      const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
        ...application,
        projectRole: application.projectRole,
        project: application.project,
        profile: {
          ...application.profile,
          user: application.profile.user,
        },
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
        projectTitle: string;
        projectDescription: string;
        projectRoleId: string;
        projectRoleTitle: string;
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
      }[],
      string
    >
  > {
    try {
      const applications = await this.prisma.projectRoleApplication.findMany({
        where: { profileId: { equals: userId } },
        include: {
          projectRole: true,
          project: true,
          profile: {
            include: {
              user: true,
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
        projectRoleDescription: string;
        projectTitle: string;
        projectDescription: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
      }[] = [];

      for (const application of applications) {
        const domainApplication = PrismaProjectRoleApplicationMapper.toDomain({
          ...application,
          profile: {
            ...application.profile,
            user: application.profile.user,
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
          projectTitle: application.project.title, // Utilise le titre actuel du projet
          projectDescription: application.project.description, // Utilise la description actuelle du projet
          status: domainApplication.value.status,
          selectedKeyFeatures: domainApplication.value.selectedKeyFeatures,
          selectedProjectGoals: domainApplication.value.selectedProjectGoals,
          appliedAt: domainApplication.value.appliedAt,
          decidedAt: domainApplication.value.decidedAt || new Date(),
          decidedBy: domainApplication.value.decidedBy || '',
          rejectionReason: domainApplication.value.rejectionReason || '',
          motivationLetter: domainApplication.value.motivationLetter || '',
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
}
