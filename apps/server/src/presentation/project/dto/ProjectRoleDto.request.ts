import { IsString, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';
import { TechStackDto } from './TechStackDto.request';

export class CreateProjectRoleDto {
  @IsString()
  @IsNotEmpty()
  roleTitle: string;

  @IsArray()
  @IsNotEmpty()
  skillSet: TechStackDto[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isFilled: boolean;
}
