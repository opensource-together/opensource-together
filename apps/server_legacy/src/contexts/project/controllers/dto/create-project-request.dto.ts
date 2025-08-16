import { Description } from '@/contexts/project/domain/vo/description.vo';
import { ShortDescription } from '@/contexts/project/domain/vo/short-description.vo';
import { Title } from '@/contexts/project/domain/vo/title.vo';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Le titre du projet',
    example: 'Mon projet',
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => Title)
  title: Title['value'];

  @ApiProperty({
    description: 'La description du projet',
    example: 'Description du projet',
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => Description)
  description: Description['value'];

  @ApiProperty({
    description: 'La description courte du projet',
    example: 'Description courte du projet',
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => ShortDescription)
  shortDescription: ShortDescription['value'];

  @ApiProperty({
    description: 'Les liens externes du projet',
    example: [{ type: 'github', url: 'https://github.com/user/repo' }],
  })
  @IsArray()
  @IsOptional()
  externalLinks: { type: string; url: string }[];

  @ApiProperty({
    description: 'Les technologies utilisées pour le projet',
    example: ['React', 'Node.js'],
  })
  @IsArray()
  @IsNotEmpty()
  techStacks: string[];

  @ApiProperty({
    description: 'Les catégories du projet',
    example: ['Web', 'Mobile'],
  })
  @IsArray()
  @IsNotEmpty()
  categories: string[];

  @ApiProperty({
    description: "L'image du projet",
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    description: 'Les images de couverture du projet',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(4, { message: 'Maximum 4 cover images allowed' })
  @IsString({ each: true })
  coverImages: string[];

  @ApiProperty({
    description: 'Le README du projet',
    example: 'README du projet',
  })
  @IsString()
  @IsOptional()
  readme: string;

  @ApiProperty({
    description: 'Les caractéristiques clés du projet',
    example: ['Fonctionnalité 1', 'Fonctionnalité 2'],
  })
  @IsArray()
  keyFeatures: string[];

  @ApiProperty({
    description: 'Les objectifs du projet',
    example: ['Objectif 1', 'Objectif 2'],
  })
  @IsArray()
  projectGoals: string[];

  @ApiProperty({
    description: 'Les rôles du projet',
    example: [
      {
        title: 'Développeur',
        description: 'Développeur du projet',
        techStacks: ['React', 'Node.js'],
      },
    ],
  })
  @IsArray()
  projectRoles: {
    title: string;
    description: string;
    techStacks: string[];
  }[];
}
