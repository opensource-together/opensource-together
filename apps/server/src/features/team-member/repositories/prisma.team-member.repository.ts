import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TeamMemberRepository } from './team-member.repository';
import { Result } from '@/libs/result';
import { CreateTeamMemberInputDto } from '../dto/create-team-member.input';
import { TeamMember } from '@prisma/client';

@Injectable()
export class PrismaTeamMemberRepository implements TeamMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTeamMember(
    input: CreateTeamMemberInputDto,
  ): Promise<Result<TeamMember, string>> {
    try {
      const teamMember = await this.prisma.teamMember.create({
        data: {
          userId: input.userId,
          projectId: input.projectId,
          projectRole: {
            connect: input.projectRole.map((role) => role)
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              githubLogin: true,
              image: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          projectRole: {
            include: {
              techStacks: true,
            },
          },
        },
      });
      return Result.ok(teamMember);
    } catch (e) {
      console.error(e);
      return Result.fail('Error creating team member');
    }
  }

  async deleteTeamMember(teamMemberId: string): Promise<Result<boolean, string>> {
    try {
      await this.prisma.teamMember.delete({
        where: {
          id: teamMemberId,
        },
      });
      return Result.ok(true);
    } catch (e) {
      console.error(e);
      return Result.fail('Error when deleting team member');
    }
  }
}
