import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateProjectDto } from '../dto/create-project.dto';

export function CreateProjectDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a project' }),
    ApiBody({
      type: CreateProjectDto,
      description: 'Data of the project to create',
    }),
  );
}
