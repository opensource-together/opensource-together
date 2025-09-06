import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class UpdateProjectRoleDto {
  @ApiProperty({
    description: 'project role',
    example: 'backend developer',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'project role description',
    example:
      'backend developer responsible for developing apis and business logic',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'project role is filled',
    example: true,
  })
  @IsBoolean()
  isFilled: boolean;

  @ApiProperty({
    description:
      "project role tech stacks, il faut envoyer toutes les tech stacks que l'on possède, sinon elles seront supprimées, un nouvel id ajoute une tech stack, un id en moins la supprime.",
    example: ['2', '3', '4', '7'],
  })
  @IsArray()
  @IsString({ each: true })
  techStacks: string[];
}
