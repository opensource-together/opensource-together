import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { TechStackDto } from './TechStackDto.request';
import { TeamMemberDto } from './TeamMemberDto.request';
import { UpdateProjectRoleDto } from './UpdateProjectRoleDto.request';
import { Type } from 'class-transformer';

export class UpdateProjectDtoRequest {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  difficulty: 'easy' | 'medium' | 'hard';

  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  githubLink: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TechStackDto)
  techStacks: TechStackDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  projectMembers: TeamMemberDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProjectRoleDto)
  projectRoles: UpdateProjectRoleDto[];
}
