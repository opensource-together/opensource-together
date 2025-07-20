import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateProjectRoleDtoRequest {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  techStacks?: string[];
}
