import { IsString, IsNotEmpty, IsArray } from 'class-validator';

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
  techStacks: string[];
}
