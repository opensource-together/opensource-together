import { Result } from '@/libs/result';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { TeamMember } from '../../domain/team-member.entity';
import { TeamMemberRepositoryPort } from '../../use-cases/ports/team-member.repository.port';

@Injectable()
export class PrismaTeamMemberRepository implements TeamMemberRepositoryPort {
  private readonly Logger = new Logger(PrismaTeamMemberRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(teamMember: TeamMember): Promise<Result<TeamMember, string>> {
    try {
      const primitive = teamMember.toPrimitive();
      const created = await this.prisma.teamMember.create({
        data: {
          userId: primitive.userId,
          projectId: primitive.projectId,
          joinedAt: primitive.joinedAt,
        },
      });

      const domainTeamMember = TeamMember.create({
        id: created.id,
        userId: created.userId,
        projectId: created.projectId,
        joinedAt: created.joinedAt,
      });

      if (!domainTeamMember.success) {
        return Result.fail(domainTeamMember.error);
      }

      return Result.ok(domainTeamMember.value);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        "Une erreur est survenue lors de la création du membre d'équipe",
      );
    }
  }

  async findByProjectId(
    projectId: string,
  ): Promise<Result<TeamMember[], string>> {
    try {
      const teamMembers = await this.prisma.teamMember.findMany({
        where: { projectId },
        include: {
          project: true,
        },
      });

      const domainTeamMembers: TeamMember[] = [];

      for (const teamMember of teamMembers) {
        const domainTeamMember = TeamMember.create({
          id: teamMember.id,
          userId: teamMember.userId,
          projectId: teamMember.projectId,
          joinedAt: teamMember.joinedAt,
        });

        if (!domainTeamMember.success) {
          return Result.fail(domainTeamMember.error);
        }

        domainTeamMembers.push(domainTeamMember.value);
      }

      return Result.ok(domainTeamMembers);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        "Une erreur est survenue lors de la récupération des membres d'équipe",
      );
    }
  }

  async findByUserId(userId: string): Promise<Result<TeamMember[], string>> {
    try {
      const teamMembers = await this.prisma.teamMember.findMany({
        where: { userId },
        include: {
          project: true,
        },
      });

      const domainTeamMembers: TeamMember[] = [];

      for (const teamMember of teamMembers) {
        const domainTeamMember = TeamMember.create({
          id: teamMember.id,
          userId: teamMember.userId,
          projectId: teamMember.projectId,
          joinedAt: teamMember.joinedAt,
        });

        if (!domainTeamMember.success) {
          return Result.fail(domainTeamMember.error);
        }

        domainTeamMembers.push(domainTeamMember.value);
      }

      return Result.ok(domainTeamMembers);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        "Une erreur est survenue lors de la récupération des membres d'équipe",
      );
    }
  }

  async findByProjectIdAndUserId(
    projectId: string,
    userId: string,
  ): Promise<Result<TeamMember | null, string>> {
    try {
      const teamMember = await this.prisma.teamMember.findFirst({
        where: {
          projectId,
          userId,
        },
      });

      if (!teamMember) {
        return Result.ok(null);
      }

      const domainTeamMember = TeamMember.create({
        id: teamMember.id,
        userId: teamMember.userId,
        projectId: teamMember.projectId,
        joinedAt: teamMember.joinedAt,
      });

      if (!domainTeamMember.success) {
        return Result.fail(domainTeamMember.error);
      }

      return Result.ok(domainTeamMember.value);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        "Une erreur est survenue lors de la récupération du membre d'équipe",
      );
    }
  }

  async delete(id: string): Promise<Result<boolean, string>> {
    try {
      await this.prisma.teamMember.delete({
        where: { id },
      });

      return Result.ok(true);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        "Une erreur est survenue lors de la suppression du membre d'équipe",
      );
    }
  }
}
