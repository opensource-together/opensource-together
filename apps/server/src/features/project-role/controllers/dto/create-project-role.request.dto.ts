import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateProjectRoleDto } from '../../domain/project-role';

export class CreateProjectRoleRequestDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @IsNotEmpty()
  roles: CreateProjectRoleDto[];
}
