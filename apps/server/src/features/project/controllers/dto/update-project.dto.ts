import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class TechStackDto {
  @ApiProperty({ description: 'Tech stack ID' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Tech stack name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tech stack icon URL' })
  @IsOptional()
  @IsUrl()
  iconUrl: string;

  @ApiProperty({ enum: ['LANGUAGE', 'TECH'] })
  @IsOptional()
  @IsEnum(['LANGUAGE', 'TECH'])
  type: 'LANGUAGE' | 'TECH';
}

export class CategoryDto {
  @ApiProperty({ description: 'Category ID' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Category name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ProjectRoleDto {
  @ApiProperty({ description: 'Role title' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Role description' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Required tech stacks for this role' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStacks: string[];
}

export class TeamMemberDto {
  @ApiProperty({ description: 'User ID' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Role in the project' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  role: string;
}

export class ExternalLinkDto {
  @ApiProperty({ description: 'External link type' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'External link URL' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'External link ID' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateProjectDto {
  @ApiProperty({ description: 'Project owner ID' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({ description: 'Project title', maxLength: 100 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Full description', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Project categories (max 6)' })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  categories: string[];

  @ApiProperty({ description: 'Project tech stacks (max 10)' })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
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

  @ApiProperty({ description: 'Project cover images' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coverImages?: string[];

  @ApiProperty({ description: 'Project readme' })
  @IsOptional()
  @IsString()
  readme?: string;

  @ApiProperty({ description: 'Project external links' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalLinkDto)
  externalLinks: { id: string; type: string; url: string }[];
}
