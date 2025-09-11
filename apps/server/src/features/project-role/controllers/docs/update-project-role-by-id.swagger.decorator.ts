import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateProjectRoleDto } from '../dto/update-project-role.dto';

export function UpdateProjectRoleByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update project role by ID',
      description:
        'Updates an existing project role with new information. All fields are required, especially the tech stacks array.',
    }),
    ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiParam({
      name: 'roleId',
      description: 'Unique identifier of the project role to update',
      type: 'string',
      format: 'uuid',
      example: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9',
    }),
    ApiCookieAuth('sAccessToken'),
    ApiBody({
      type: UpdateProjectRoleDto,
      description: 'Updated project role data. All fields are required.',
      examples: {
        frontend: {
          summary: 'Update Frontend Developer Role',
          description: 'Update a frontend developer role with new requirements',
          value: {
            title: 'Senior Frontend Developer',
            description:
              'Lead the development of user interfaces using React, TypeScript, and modern web technologies. Must have 5+ years of experience with React ecosystem, state management, and testing frameworks.',
            techStacks: ['3', '9', '17', '23', '24'],
          },
        },
        backend: {
          summary: 'Update Backend Developer Role',
          description: 'Update a backend developer role with new requirements',
          value: {
            title: 'Senior Backend Developer',
            description:
              'Develop and maintain scalable server-side applications using Node.js, NestJS, and PostgreSQL. Focus on microservices architecture, API design, and database optimization.',
            techStacks: ['7', '8', '18', '25', '26'],
          },
        },
        fullstack: {
          summary: 'Update Full Stack Developer Role',
          description:
            'Update a full stack developer role with new requirements',
          value: {
            title: 'Full Stack Developer',
            description:
              'Work on both frontend and backend components. Experience with React, Node.js, cloud technologies, and DevOps practices required.',
            techStacks: ['3', '7', '9', '19', '20'],
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Project role updated successfully',
      example: {
        id: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9',
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Senior Frontend Developer',
        description:
          'Lead the development of user interfaces using React, TypeScript, and modern web technologies. Must have 5+ years of experience with React ecosystem, state management, and testing frameworks.',
        isFilled: false,
        createdAt: '2025-01-20T14:30:00.000Z',
        updatedAt: '2025-01-20T15:45:00.000Z',
        techStacks: [
          {
            id: '3',
            name: 'React',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
            type: 'TECH',
          },
          {
            id: '9',
            name: 'TypeScript',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
            type: 'LANGUAGE',
          },
          {
            id: '17',
            name: 'Tailwind CSS',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
            type: 'TECH',
          },
          {
            id: '23',
            name: 'Jest',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-original.svg',
            type: 'TECH',
          },
          {
            id: '24',
            name: 'Redux',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg',
            type: 'TECH',
          },
        ],
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Validation failed',
      examples: {
        validation: {
          summary: 'Validation errors',
          value: {
            message: [
              'property title should not be empty',
              'property description should not be empty',
              'techStacks must contain at least 1 element',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        invalidId: {
          summary: 'Invalid ID format',
          value: {
            message: 'Invalid UUID format',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Project does not belong to user',
      example: {
        message: 'You do not have permission to update this project role',
        statusCode: 403,
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Project role not found',
      example: {
        message: 'Project role not found',
        statusCode: 404,
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      example: {
        message: 'Internal server error',
        statusCode: 500,
      },
    }),
  );
}
