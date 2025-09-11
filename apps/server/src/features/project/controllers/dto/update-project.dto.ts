import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProjectRoleDto } from './create-project.dto';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  coverImages: string[];

  @IsString()
  @IsOptional()
  readme: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  projectRoles?: ProjectRoleDto[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  keyFeatures: string[];

  @IsArray()
  @IsString({ each: true })
  techStacks: string[];

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsArray()
  @IsOptional()
  externalLinks: Array<{
    id?: string;
    type: 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'DISCORD' | 'WEBSITE';
    url: string;
  }>;
}
