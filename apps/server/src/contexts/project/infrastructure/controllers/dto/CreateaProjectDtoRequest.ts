import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TechStackDto } from './TechStackDto.request';
import { CreateProjectRoleDto } from '@/presentation/projectRole/dto/CreateProjectRoleDto.request';
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
  @ValidateNested({ each: true })
  @Type(() => TechStackDto)
  techStacks: TechStackDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  projectMembers: TeamMemberDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectRoleDto)
  projectRoles: CreateProjectRoleDto[];
}
