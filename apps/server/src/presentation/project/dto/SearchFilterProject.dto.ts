// apps/server/src/presentation/project/dto/filter-projects.dto.ts

import { IsEnum, IsOptional, IsArray, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { Difficulty } from '@prisma/client';

export class FilterProjectsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(Difficulty, {
    message: 'difficulty must be a valid difficulty : EASY, MEDIUM, HARD',
  })
  @IsOptional()
  difficulty?: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    // Supporte à la fois les tableaux natifs et les chaînes avec virgules
    if (Array.isArray(value)) return value as string[];
    else if (typeof value === 'string') return value.split(',');
    return undefined;
  })
  roles?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    // Supporte à la fois les tableaux natifs et les chaînes avec virgules
    if (Array.isArray(value)) return value as string[];
    else if (typeof value == 'string') return value.split(',');
    return undefined;
  })
  techStacks?: string[];

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
