import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TechStackDto } from './TechStackDto.request';

export class CreateProjectRoleDto {
  @IsString()
  @IsNotEmpty()
  roleTitle: string;

  // @IsString()
  // projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechStackDto)
  skillSet: TechStackDto[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isFilled: boolean;
}
