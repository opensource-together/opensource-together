import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProjectRoleRequestDto } from '../dto/create-project-role.request.dto';

export function CreateProjectRoleDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a project role' }),
    ApiBody({
      type: CreateProjectRoleRequestDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Project role created successfully',
      example: [
        {
          id: 'c3e87112-bf1e-47b3-b45b-b20a89c72c4c',
          projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
          title: 'Devops',
          description: 'Devops pro',
          isFilled: false,
          createdAt: '2025-09-05T16:20:43.597Z',
          updatedAt: '2025-09-05T16:20:43.597Z',
        },
      ],
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request',
      example: {
        error: 'Bad request',
      },
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
