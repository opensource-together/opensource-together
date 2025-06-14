import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { TechStackDto } from './TechStackDto.request';
import { Type } from 'class-transformer';

export class UpdateProjectRoleDto {
  @IsString()
  @IsNotEmpty()
  id: string; // ID obligatoire pour identifier le rôle à modifier

  @IsString()
  @IsOptional() // Optionnel car on ne modifie pas forcément tous les champs
  roleTitle?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TechStackDto)
  skillSet?: TechStackDto[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isFilled?: boolean;
}
