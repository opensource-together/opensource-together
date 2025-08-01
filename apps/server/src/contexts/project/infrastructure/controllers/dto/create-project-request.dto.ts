import { Description } from '@/contexts/project/domain/vo/description.vo';
import { ShortDescription } from '@/contexts/project/domain/vo/short-description.vo.';
import { Title } from '@/contexts/project/domain/vo/title.vo';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDtoRequest {
  @IsString()
  @IsNotEmpty()
  @Type(() => Title)
  title: Title['value'];

  @IsString()
  @IsNotEmpty()
  @Type(() => Description)
  description: Description['value'];

  @IsString()
  @IsNotEmpty()
  @Type(() => ShortDescription)
  shortDescription: ShortDescription['value'];

  @IsArray()
  @IsOptional()
  externalLinks: { type: string; url: string }[];

  @IsArray()
  @IsNotEmpty()
  techStacks: string[];

  @IsArray()
  @IsNotEmpty()
  categories: string[];

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(4, { message: 'Maximum 4 cover images allowed' })
  @IsString({ each: true })
  coverImages: string[];

  @IsString()
  @IsOptional()
  readme: string;

  @IsArray()
  keyFeatures: string[];

  @IsArray()
  projectGoals: string[];

  @IsArray()
  projectRoles: {
    title: string;
    description: string;
    techStacks: string[];
  }[];
}
