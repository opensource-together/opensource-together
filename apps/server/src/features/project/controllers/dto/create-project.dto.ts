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
  MinLength,
  ValidateNested,
} from 'class-validator';

export class TechStackDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  iconUrl: string;

  @IsEnum(['LANGUAGE', 'TECH'])
  type: 'LANGUAGE' | 'TECH';
}

export class ProjectRoleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  techStacks: string[];
}

export class TeamMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  categories: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  techStacks: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => ProjectRoleDto)
  projectRoles: ProjectRoleDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  keyFeatures: string[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  teamMembers?: TeamMemberDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @IsString({ each: true })
  coverImages?: string[];

  @IsOptional()
  @IsString()
  readme?: string;

  @IsArray()
  @IsOptional()
  externalLinks: Array<{
    id?: string;
    type: 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'DISCORD' | 'WEBSITE';
    url: string;
  }>;
}
