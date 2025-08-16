import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';
// import { Type } from 'class-transformer';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsObject()
  @IsOptional()
  socialLinks?: {
    github?: string;
    discord?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };

  @IsArray()
  @IsOptional()
  experiences?: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
  }[];

  @IsArray()
  @IsOptional()
  skills?: { name: string; level: string }[];

  @IsArray()
  @IsOptional()
  projects?: { name: string; description: string; url: string }[];

  @IsArray()
  @IsOptional()
  techStacks?: string[];
}
