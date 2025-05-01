import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { TechStackDto } from './TechStackDto.request';
/**
 * DTO for creating a new project
 * @class CreateProjectDtoRequest
 * @property {string} title - The title of the project
 * @property {string} description - The description of the project
 * @property {string} link - The link to the project
 * @property {'PUBLISHED' | 'DRAFT'} status - The status of the project
 * @property {TechStackDto[]} techStacks - Array of technology stacks used in the project
 */

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

  @IsString()
  @IsNotEmpty()
  status: 'PUBLISHED' | 'DRAFT';

  @IsArray()
  @IsNotEmpty()
  techStacks: TechStackDto[];
}
