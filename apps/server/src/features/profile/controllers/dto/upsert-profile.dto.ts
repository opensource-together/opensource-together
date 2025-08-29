import { IsString } from 'class-validator';

export class UpsertProfileDto {
  @IsString()
  bio: string;

  @IsString()
  location: string;

  @IsString()
  company: string;

  @IsString()
  jobTitle: string;
}
