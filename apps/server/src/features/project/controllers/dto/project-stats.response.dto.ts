import { RepositoryStats } from '@/features/github/repositories/github.repository.interface';
import { Result } from '@/libs/result';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { User } from '@prisma/client';

class LastCommitAuthorResponseDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  avatar_url: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  html_url: string;
}

class LastCommitResponseDto {
  @IsString()
  date: string;

  @IsString()
  message: string;

  @IsString()
  @IsNotEmpty()
  sha: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ValidateNested()
  @Type(() => LastCommitAuthorResponseDto)
  author: LastCommitAuthorResponseDto;
}

class ContributorResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  avatarUrl: string | null;

  @IsNumber()
  contributions: number;
}

export class ProjectStatsResponseDto {
  @IsNumber()
  stars: number;

  @IsNumber()
  forks: number;

  @IsArray()
  @ValidateNested()
  @Type(() => ContributorResponseDto)
  contributors: ContributorResponseDto[];

  @ValidateNested()
  @Type(() => LastCommitResponseDto)
  lastCommit: LastCommitResponseDto;
}

export function adaptRepositoryStatsToDto(
  input: RepositoryStats,
  members: User[],
): Result<ProjectStatsResponseDto> {
  const stars = input.stats.stars;
  const forks = input.stats.forks;

  const contributors =
    members.map((m) => {
      return {
        id: m.id,
        username: m.name || '',
        avatarUrl: m.image || '',
        contributions: 0,
      };
    }) || [];

  const lastCommit = input.commits.lastCommit;

  return Result.ok({
    stars: stars,
    forks: forks,
    contributors: contributors,
    lastCommit: lastCommit,
  });
}
