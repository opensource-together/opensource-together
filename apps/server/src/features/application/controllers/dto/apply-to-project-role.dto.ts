import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ApplyToProjectRoleDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  keyFeatures: string[];

  @IsString()
  @IsNotEmpty()
  motivationLetter: string;
}
