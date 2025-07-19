import { IsString, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Title } from '@/contexts/project/domain/vo/title.vo';
import { Description } from '@/contexts/project/domain/vo/description.vo';
import { ShortDescription } from '@/contexts/project/domain/vo/short-description.vo.';

export class UpdateProjectDtoRequest {
  @IsString()
  @IsOptional()
  @Type(() => Title)
  title?: Title['value'];

  @IsString()
  @IsOptional()
  @Type(() => Description)
  description?: Description['value'];

  @IsString()
  @IsOptional()
  @Type(() => ShortDescription)
  shortDescription?: ShortDescription['value'];

  @IsArray()
  @IsOptional()
  externalLinks?: { type: string; url: string }[];

  @IsArray()
  @IsOptional()
  techStacks?: string[];

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsArray()
  @IsOptional()
  keyFeatures?: (string | { id: string; feature: string })[];

  @IsArray()
  @IsOptional()
  projectGoals?: (string | { id: string; goal: string })[];
}
