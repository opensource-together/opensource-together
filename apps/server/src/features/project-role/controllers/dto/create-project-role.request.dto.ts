import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateProjectRoleRequestDto {
  @ApiProperty({
    description: 'Project roles',
    example: [
      {
        title: 'Project role 1',
        description: 'Project role 1 description',
        techStacks: ['1', '2'],
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  projectRoles: {
    title: string;
    description: string;
    techStacks: string[];
  }[];
}
