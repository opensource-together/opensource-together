import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateProjectDtoRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

	@IsString()
  @IsNotEmpty()
  description: string;

	@IsArray()
  @IsNotEmpty()
  techStacks: string[];
}
