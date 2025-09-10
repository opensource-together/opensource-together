import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function FindAllProjectRolesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all project roles',
      description:
        'Retrieves all available roles for a specific project. This endpoint is public and does not require authentication.',
    }),
    ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project to get roles for',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Project roles retrieved successfully',
      example: [
        {
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
        },
        {
          id: 'c7130a7c-09b4-46dd-8f5d-043938cf40b9',
          projectId: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Backend Developer',
          description:
            'Develop and maintain server-side applications using Node.js, NestJS, and PostgreSQL. Focus on API design, database optimization, and system architecture.',
          isFilled: false,
          techStacks: [
            {
              id: '7',
              name: 'Node.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
              type: 'TECH',
            },
            {
              id: '8',
              name: 'NestJS',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg',
              type: 'TECH',
            },
            {
              id: '18',
              name: 'PostgreSQL',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
              type: 'TECH',
            },
          ],
        },
        {
          id: 'd7130a7c-09b4-46dd-8f5d-043938cf40b9',
          projectId: '123e4567-e89b-12d3-a456-426614174000',
          title: 'DevOps Engineer',
          description:
            'Manage infrastructure, CI/CD pipelines, and cloud deployment. Experience with Docker, Kubernetes, and AWS required.',
          isFilled: true,
          techStacks: [
            {
              id: '20',
              name: 'Docker',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
              type: 'TECH',
            },
            {
              id: '21',
              name: 'Kubernetes',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg',
              type: 'TECH',
            },
            {
              id: '22',
              name: 'AWS',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg',
              type: 'TECH',
            },
          ],
        },
      ],
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid project ID format',
      example: {
        message: 'Invalid UUID format',
        statusCode: 400,
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Project not found',
      example: {
        message: 'Project not found',
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
