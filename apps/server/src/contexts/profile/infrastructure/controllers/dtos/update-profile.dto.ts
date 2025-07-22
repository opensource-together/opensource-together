import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsUrl,
  IsIn,
  MaxLength,
} from 'class-validator';

export class SocialLinkDto {
  @ApiProperty({
    description: 'Type de lien social',
    enum: ['github', 'twitter', 'linkedin', 'website'],
    example: 'github',
  })
  @IsString()
  @IsIn(['github', 'twitter', 'linkedin', 'website'])
  type: string;

  @ApiProperty({
    description: 'URL du lien social',
    example: 'https://github.com/johndoe',
  })
  @IsUrl()
  url: string;
}

export class ExperienceDto {
  @ApiProperty({
    description: "Nom de l'entreprise",
    example: 'Tech Corp',
  })
  @IsString()
  company: string;

  @ApiProperty({
    description: 'Poste occupé',
    example: 'Senior Developer',
  })
  @IsString()
  position: string;

  @ApiProperty({
    description: 'Date de début (ISO 8601)',
    example: '2020-01-15',
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'Date de fin (ISO 8601)',
    example: '2023-12-31',
    required: false,
  })
  @IsString()
  @IsOptional()
  endDate?: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'URL de l\'avatar',
    example: 'https://avatars.githubusercontent.com/u/12345',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Biographie',
    example: 'Fullstack Developer | React & Node.js enthusiast',
    required: false,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;

  @ApiProperty({
    description: 'Localisation',
    example: 'Paris, France',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Entreprise',
    example: 'Tech Corp',
    required: false,
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({
    description: 'Liens sociaux',
    type: [SocialLinkDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @ApiProperty({
    description: 'Expériences professionnelles',
    type: [ExperienceDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experiences?: ExperienceDto[];
}