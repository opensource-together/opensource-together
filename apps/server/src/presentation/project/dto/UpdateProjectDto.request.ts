import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { TechStackDto } from './TechStackDto.request';

export class UpdateProjectDtoRequest {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  link: string;

  @IsArray()
  @IsOptional()
  projectRoles: object[];

  @IsString()
  @IsOptional()
  status: 'PUBLISHED' | 'DRAFT';

  @IsArray()
  @IsOptional()
  techStacks: TechStackDto[];
}
