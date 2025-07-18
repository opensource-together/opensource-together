import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplyToRoleRequestDto {
  @IsNotEmpty()
  @IsArray()
  keyFeatures: string[];

  @IsNotEmpty()
  @IsArray()
  projectGoals: string[];

  @IsOptional()
  @IsString()
  motivationLetter?: string;
}
