import { Result } from '@/libs/result';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TeamMember } from '../../domain/team-member.entity';
import {
  TEAM_MEMBER_REPOSITORY_PORT,
  TeamMemberRepositoryPort,
} from '../ports/team-member.repository.port';

export class AddTeamMemberCommand implements ICommand {
  constructor(
    public readonly props: {
      userId: string;
      projectId: string;
      projectRoleId?: string; // Ajout du projectRoleId optionnel
    },
  ) {}
}

@CommandHandler(AddTeamMemberCommand)
export class AddTeamMemberCommandHandler
  implements ICommandHandler<AddTeamMemberCommand>
{
  private readonly Logger = new Logger(AddTeamMemberCommand.name);

  constructor(
    @Inject(TEAM_MEMBER_REPOSITORY_PORT)
    private readonly teamMemberRepository: TeamMemberRepositoryPort,
  ) {}

  async execute(
    command: AddTeamMemberCommand,
  ): Promise<Result<TeamMember, string>> {
    const { userId, projectId, projectRoleId } = command.props;

    // Vérifier si l'utilisateur est déjà membre du projet
    const existingMember =
      await this.teamMemberRepository.findByProjectIdAndUserId(
        projectId,
        userId,
      );

    if (!existingMember.success) {
      return Result.fail(existingMember.error);
    }

    if (existingMember.value) {
      // Si l'utilisateur existe déjà, on peut essayer d'ajouter le rôle s'il est fourni
      if (projectRoleId && existingMember.value.id) {
        const updatedMember = await this.teamMemberRepository.addRoleToMember(
          existingMember.value.id,
          projectRoleId,
        );
        if (!updatedMember.success) {
          return Result.fail(updatedMember.error);
        }
        return Result.ok(updatedMember.value);
      }
      return Result.fail('User is already a member of this project');
    }

    // Créer le nouveau membre d'équipe
    const teamMemberResult = TeamMember.create({
      userId,
      projectId,
      joinedAt: new Date(),
      projectRoleIds: projectRoleId ? [projectRoleId] : [], // Utiliser projectRoleIds au lieu de projectRoleId
    });

    if (!teamMemberResult.success) {
      return Result.fail(teamMemberResult.error);
    }

    // Sauvegarder le membre d'équipe
    const savedTeamMember = await this.teamMemberRepository.create(
      teamMemberResult.value,
    );

    if (!savedTeamMember.success) {
      return Result.fail(savedTeamMember.error);
    }

    this.Logger.log(
      `User ${userId} successfully added as team member to project ${projectId} with role ${projectRoleId || 'none'}`,
    );

    return Result.ok(savedTeamMember.value);
  }
}
