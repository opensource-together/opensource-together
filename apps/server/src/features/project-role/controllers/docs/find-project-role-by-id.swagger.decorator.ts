import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function FindProjectRoleByIdDocs() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Get project role by ID',
      description: 'Retrieves detailed information about a specific project role including its requirements and associated technologies. This endpoint is public and does not require authentication.'
    }),
    ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    ApiParam({
      name: 'roleId',
      description: 'Unique identifier of the project role',
      type: 'string',
      format: 'uuid',
      example: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9'
    }),
    ApiResponse({
      status: 200,
      description: 'Project role retrieved successfully',
      example: {
        id: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9',
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Senior Frontend Developer',
        description: 'Lead the development of user interfaces using React, TypeScript, and modern web technologies. Responsible for creating responsive, accessible, and performant web applications. Must have experience with state management, testing frameworks, and performance optimization.',
        isFilled: false,
        createdAt: '2025-01-20T14:30:00.000Z',
        updatedAt: '2025-01-20T14:30:00.000Z',
        techStacks: [
          {
            id: '3',
            name: 'React',
            iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
            type: 'TECH'
          },
          {
            id: '9',
            name: 'TypeScript',
            iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
            type: 'LANGUAGE'
          },
          {
            id: '17',
            name: 'Tailwind CSS',
            iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
            type: 'TECH'
          },
          {
            id: '23',
            name: 'Jest',
            iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-original.svg',
            type: 'TECH'
          }
        ]
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid ID format',
      example: {
        message: 'Invalid UUID format',
        statusCode: 400
      }
    }),
    ApiResponse({
      status: 404,
      description: 'Project role not found',
      example: {
        message: 'Project role not found',
        statusCode: 404
      }
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      example: {
        message: 'Internal server error',
        statusCode: 500
      }
    })
  );
}
