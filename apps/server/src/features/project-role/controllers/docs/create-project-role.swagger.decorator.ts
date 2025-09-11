import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateProjectRoleRequestDto } from '../dto/create-project-role.request.dto';

export function CreateProjectRoleDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a project role',
      description:
        'Creates a new role for a specific project. The role can be filled by contributors who apply and get accepted for the position.',
    }),
    ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project to create a role for',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiCookieAuth('sAccessToken'),
    ApiBody({
      type: CreateProjectRoleRequestDto,
      description:
        'Project role data including title, description, and required technologies',
      examples: {
        frontend: {
          summary: 'Frontend Developer Role',
          description: 'Create a role for a frontend developer position',
          value: {
            title: 'Senior Frontend Developer',
            description:
              'Lead the development of user interfaces using React, TypeScript, and modern web technologies. Responsible for creating responsive, accessible, and performant web applications.',
            techStacks: ['3', '9', '17'],
          },
        },
        backend: {
          summary: 'Backend Developer Role',
          description: 'Create a role for a backend developer position',
          value: {
            title: 'Backend Developer',
            description:
              'Develop and maintain server-side applications using Node.js, NestJS, and PostgreSQL. Focus on API design, database optimization, and system architecture.',
            techStacks: ['7', '8', '18'],
          },
        },
        fullstack: {
          summary: 'Full Stack Developer Role',
          description: 'Create a role for a full stack developer position',
          value: {
            title: 'Full Stack Developer',
            description:
              'Work on both frontend and backend components of the application. Experience with React, Node.js, and cloud technologies required.',
            techStacks: ['3', '7', '9', '19'],
          },
        },
        devops: {
          summary: 'DevOps Engineer Role',
          description: 'Create a role for a DevOps engineer position',
          value: {
            title: 'DevOps Engineer',
            description:
              'Manage infrastructure, CI/CD pipelines, and cloud deployment. Experience with Docker, Kubernetes, and AWS required.',
            techStacks: ['20', '21', '22'],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Project role created successfully',
      example: {
        id: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9',
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Senior Frontend Developer',
        description:
          'Lead the development of user interfaces using React, TypeScript, and modern web technologies. Responsible for creating responsive, accessible, and performant web applications.',
        isFilled: false,
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
        ],
        createdAt: '2025-01-20T14:30:00.000Z',
        updatedAt: '2025-01-20T14:30:00.000Z',
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
        invalidProject: {
          summary: 'Invalid project ID',
          value: {
            message: 'Project not found',
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
        message: 'You do not have permission to create roles for this project',
        statusCode: 403,
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
