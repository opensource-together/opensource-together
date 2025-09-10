import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpsertProfileDto {
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStacks?: string[];

  @IsOptional()
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    discord?: string;
    website?: string;
  };
}
