import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { TechStackDto } from '@/contexts/project/infrastructure/controllers/dto/TechStackDto.request';
import { Type } from 'class-transformer';

export class UpdateProjectRoleDto {
  @IsString()
  @IsOptional()
  roleTitle: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TechStackDto)
  skillSet: TechStackDto[];

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isFilled: boolean;
}
