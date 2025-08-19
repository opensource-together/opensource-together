import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsUrl,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TechStackDto {
  @ApiProperty({ description: 'Tech stack ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Tech stack name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tech stack icon URL' })
  @IsUrl()
  iconUrl: string;

  @ApiProperty({ enum: ['LANGUAGE', 'TECH'] })
  @IsEnum(['LANGUAGE', 'TECH'])
  type: 'LANGUAGE' | 'TECH';
}

export class CategoryDto {
  @ApiProperty({ description: 'Category ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ProjectRoleDto {
  @ApiProperty({ description: 'Role title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Role description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Required tech stacks for this role' })
  @IsArray()
  @IsString({ each: true })
  techStacks: string[];
}

export class TeamMemberDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Role in the project' })
  @IsString()
  @IsNotEmpty()
  role: string;
}

export class CreateProjectDto {
  @ApiProperty({ description: 'Project owner ID' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({ description: 'Project title', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Full description', maxLength: 1000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Project categories' })
  @IsArray()
  @ArrayMinSize(1)
  categories: string[];

  @ApiProperty({ description: 'Project tech stacks' })
  @IsArray()
  @ArrayMinSize(1)
  techStacks: string[];

  // Éléments optionnels
  @ApiProperty({ description: 'Project roles (optional)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectRoleDto)
  projectRoles?: ProjectRoleDto[];

  @ApiProperty({ description: 'Project image' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Team members (optional)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  teamMembers?: TeamMemberDto[];
}
