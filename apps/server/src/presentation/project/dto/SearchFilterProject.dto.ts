// apps/server/src/presentation/project/dto/filter-projects.dto.ts

import { IsEnum, IsOptional, IsArray, IsString, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Difficulty } from '@prisma/client';

export class FilterProjectsDto {
  @IsEnum(Difficulty, {
    message: 'difficulty must be a valid difficulty : EASY, MEDIUM, HARD',
  })
  @IsOptional()
  difficulty?: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    // Transforme "frontend,backend" en ["frontend", "backend"]
    return value ? value.split(',') : undefined;
  })
  roles?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? value.split(',') : undefined;
  })
  techStacks?: string[];

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
