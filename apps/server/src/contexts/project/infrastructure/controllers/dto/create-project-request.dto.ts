import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Title } from '@/contexts/project/domain/vo/title.vo';
import { Description } from '@/contexts/project/domain/vo/description.vo';
import { ShortDescription } from '@/contexts/project/domain/vo/short-description.vo.';
import { TechStackDto } from './TechStackDto.request';

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
  @ValidateNested({ each: true })
  @Type(() => TechStackDto)
  techStacks: { id: string; name: string; iconUrl: string }[];

  @IsArray()
  projectRoles: {
    title: string;
    description: string;
    isFilled: boolean;
    techStacks: { id: string; name: string; iconUrl: string }[];
  }[];
}
