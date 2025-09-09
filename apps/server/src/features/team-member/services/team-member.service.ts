import { Injectable } from "@nestjs/common";
import { PrismaTeamMemberRepository } from "../repositories/prisma.team-member.repository";
import { Result } from "@/libs/result";
import { CreateTeamMemberInputDto } from "../dto/create-team-member.input";
import { TeamMember } from "@prisma/client";


@Injectable()
export class TeamMemberService {
  constructor(private readonly teamMemberRepository: PrismaTeamMemberRepository) {}

  async addMemberToProject(teamMemberInviteDto: CreateTeamMemberInputDto): Promise<Result<TeamMember, string>> {
    return await this.teamMemberRepository.createTeamMember(teamMemberInviteDto); 
  }

  async deleteMemberFromProject(teamMemberId: string): Promise<Result<boolean, string>> {
    return await this.teamMemberRepository.deleteTeamMember(teamMemberId);
  }
}
