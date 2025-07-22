import { IsString, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

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

  @IsArray()
  @IsOptional()
  socialLinks?: { type: string; url: string }[];

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
}