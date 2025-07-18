import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectRoleDtoRequest {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  techStacks: string[];
}
