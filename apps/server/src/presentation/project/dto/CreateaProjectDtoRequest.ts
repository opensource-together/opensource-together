import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { TechStackDto } from './TechStackDto.request';
export class CreateProjectDtoRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsArray()
  @IsNotEmpty()
  projectRoles: object[];

  @IsArray()
  @IsNotEmpty()
  techStacks: TechStackDto[];
}
