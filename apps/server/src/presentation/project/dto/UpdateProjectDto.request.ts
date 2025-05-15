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

  @IsString()
  @IsOptional()
  status: 'PUBLISHED' | 'DRAFT';

  @IsArray()
  @IsOptional()
  techStacks: TechStackDto[];
}
