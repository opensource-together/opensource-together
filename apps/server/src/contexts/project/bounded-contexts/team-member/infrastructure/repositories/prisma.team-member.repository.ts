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

      // Préparer les données pour la création
      const createData: {
        userId: string;
        projectId: string;
        joinedAt: Date;
        projectRole?: { connect: { id: string }[] };
      } = {
        userId: primitive.userId,
        projectId: primitive.projectId,
        joinedAt: primitive.joinedAt,
      };

      // Ajouter les rôles s'ils existent
      if (primitive.projectRoleIds && primitive.projectRoleIds.length > 0) {
        createData.projectRole = {
          connect: primitive.projectRoleIds.map((roleId) => ({ id: roleId })),
        };
      }

      const created = await this.prisma.teamMember.create({
        data: createData,
        include: {
          projectRole: true,
        },
      });

      const domainTeamMember = TeamMember.create({
        id: created.id,
        userId: created.userId,
        projectId: created.projectId,
        joinedAt: created.joinedAt,
        projectRoleIds: created.projectRole.map((role) => role.id),
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
          projectRole: true,
        },
      });

      const domainTeamMembers: TeamMember[] = [];

      for (const teamMember of teamMembers) {
        const domainTeamMember = TeamMember.create({
          id: teamMember.id,
          userId: teamMember.userId,
          projectId: teamMember.projectId,
          joinedAt: teamMember.joinedAt,
          projectRoleIds: teamMember.projectRole.map((role) => role.id),
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
          projectRole: true,
        },
      });

      const domainTeamMembers: TeamMember[] = [];

      for (const teamMember of teamMembers) {
        const domainTeamMember = TeamMember.create({
          id: teamMember.id,
          userId: teamMember.userId,
          projectId: teamMember.projectId,
          joinedAt: teamMember.joinedAt,
          projectRoleIds: teamMember.projectRole.map((role) => role.id),
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
        include: {
          projectRole: true,
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
        projectRoleIds: teamMember.projectRole.map((role) => role.id),
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

  async addRoleToMember(
    memberId: string,
    roleId: string,
  ): Promise<Result<TeamMember, string>> {
    try {
      // Récupérer le membre d'équipe existant
      const existingMember = await this.prisma.teamMember.findUnique({
        where: { id: memberId },
        include: {
          projectRole: true,
        },
      });

      if (!existingMember) {
        return Result.fail('Team member not found');
      }

      // Vérifier si le rôle existe
      const role = await this.prisma.projectRole.findUnique({
        where: { id: roleId },
      });

      if (!role) {
        return Result.fail('Project role not found');
      }

      // Vérifier si le rôle est déjà associé au membre
      const hasRole = existingMember.projectRole.some(
        (role) => role.id === roleId,
      );
      if (hasRole) {
        return Result.fail('Role is already assigned to this member');
      }

      // Ajouter le rôle au membre
      const updatedMember = await this.prisma.teamMember.update({
        where: { id: memberId },
        data: {
          projectRole: {
            connect: { id: roleId },
          },
        },
        include: {
          projectRole: true,
        },
      });

      // Créer l'entité de domaine avec les rôles
      const domainTeamMember = TeamMember.create({
        id: updatedMember.id,
        userId: updatedMember.userId,
        projectId: updatedMember.projectId,
        joinedAt: updatedMember.joinedAt,
        projectRoleIds: updatedMember.projectRole.map((role) => role.id),
      });

      if (!domainTeamMember.success) {
        return Result.fail(domainTeamMember.error);
      }

      return Result.ok(domainTeamMember.value);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(
        "Une erreur est survenue lors de l'ajout du rôle au membre d'équipe",
      );
    }
  }
}
