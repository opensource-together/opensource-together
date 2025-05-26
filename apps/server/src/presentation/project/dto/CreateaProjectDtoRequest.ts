import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { TechStackDto } from './TechStackDto.request';
import { CreateProjectRoleDto } from './ProjectRoleDto.request';
import { TeamMemberDto } from './TeamMemberDto.request';
export class CreateProjectDtoRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  difficulty: 'easy' | 'medium' | 'hard';

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  githubLink: string;

  @IsArray()
  @IsNotEmpty()
  techStacks: TechStackDto[];

  @IsArray()
  projectMembers: TeamMemberDto[];

  @IsArray()
  projectRoles: CreateProjectRoleDto[];
}
