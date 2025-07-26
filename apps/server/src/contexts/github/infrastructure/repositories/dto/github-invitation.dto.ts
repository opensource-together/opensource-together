import {
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { GithubRepositoryPermissionsDto } from './github-permissions.dto';
import { GithubRepositoryDto } from './github-repository.dto';
import { GithubUserDto } from './github-user.dto';
import { Type } from 'class-transformer';

export class GithubInvitationDto {
  @IsNumber()
  id: number;

  @IsString()
  node_id: string;

  @ValidateNested()
  @Type(() => GithubRepositoryDto)
  repository: GithubRepositoryDto;

  @ValidateNested()
  @Type(() => GithubUserDto)
  invitee: GithubUserDto;

  @ValidateNested()
  @Type(() => GithubUserDto)
  inviter: GithubUserDto;

  @IsEnum(GithubRepositoryPermissionsDto)
  permissions: GithubRepositoryPermissionsDto;

  @IsUrl()
  html_url: string;
}
