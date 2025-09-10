import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectRoleRequestDto {
  @ApiProperty({
    description: 'Role title',
    example: 'Frontend Developer',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  title: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Develop user interfaces and user experience',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(250)
  description: string;

  @ApiProperty({
    description: 'Required tech stacks',
    example: ['1', '2'],
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  techStacks: string[];
}
