import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateProjectDto } from '../dto/update-project.dto';

export function UpdateProjectByIdDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({
      summary: 'Update project by ID',
      description:
        'Updates an existing project with new information. If the title or description changes, the associated GitHub repository will also be updated automatically.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the project to update',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: UpdateProjectDto,
      description:
        'Updated project data. All fields are optional except those marked as required.',
      examples: {
        fullUpdate: {
          summary: 'Complete project update',
          description:
            'Update all project fields including roles and external links',
          value: {
            title: 'Updated E-commerce Platform',
            description:
              'Enhanced e-commerce application with new features including AI-powered recommendations, advanced analytics, and improved user experience.',
            categories: ['1', '4', '6'],
            techStacks: ['3', '7', '9', '12'],
            projectRoles: [
              {
                title: 'Senior Frontend Developer',
                description:
                  'Lead frontend development with React, TypeScript, and modern state management',
                techStacks: ['3', '9'],
              },
              {
                title: 'Backend Developer',
                description:
                  'Develop scalable APIs and microservices with Node.js and NestJS',
                techStacks: ['7', '8'],
              },
              {
                title: 'DevOps Engineer',
                description:
                  'Manage infrastructure, CI/CD pipelines, and cloud deployment',
                techStacks: ['13', '14'],
              },
            ],
            keyFeatures: [
              'AI-powered recommendations',
              'Advanced analytics dashboard',
              'Real-time notifications',
              'Mobile-responsive design',
              'Payment gateway integration',
            ],
            image: 'https://example.com/updated-project-logo.png',
            coverImages: [
              'https://example.com/cover-1.png',
              'https://example.com/cover-2.png',
              'https://example.com/cover-3.png',
            ],
            readme:
              '# Updated E-commerce Platform\n\nEnhanced features and improved architecture...',
            externalLinks: [
              {
                id: '6c361ece-8e85-46b0-8888-d620c9b1f878',
                type: 'GITHUB',
                url: 'https://github.com/y2_znt/ecommerce-platform',
              },
              {
                id: 'd89809b3-fa85-4c0b-984f-1b1cf672a3a9',
                type: 'WEBSITE',
                url: 'https://ecommerce-platform.com',
              },
              {
                id: 'e89809b3-fa85-4c0b-984f-1b1cf672a3a9',
                type: 'DISCORD',
                url: 'https://discord.gg/ecommerce-platform',
              },
              {
                id: 'f89809b3-fa85-4c0b-984f-1b1cf672a3a9',
                type: 'TWITTER',
                url: 'https://twitter.com/ecommerce_platform',
              },
            ],
          },
        },
        partialUpdate: {
          summary: 'Partial project update',
          description: 'Update only specific fields, keeping others unchanged',
          value: {
            title: 'E-commerce Platform v2.0',
            description:
              'Updated description with new features and improvements',
            keyFeatures: [
              'Enhanced user interface',
              'Better performance',
              'New payment methods',
            ],
            externalLinks: [
              {
                id: '6c361ece-8e85-46b0-8888-d620c9b1f878',
                type: 'GITHUB',
                url: 'https://github.com/y2_znt/ecommerce-platform-v2',
              },
            ],
          },
        },
        rolesUpdate: {
          summary: 'Update project roles only',
          description:
            'Update only the project roles without changing other fields',
          value: {
            projectRoles: [
              {
                title: 'Full Stack Developer',
                description: 'Work on both frontend and backend components',
                techStacks: ['3', '7', '9'],
              },
              {
                title: 'UI/UX Designer',
                description:
                  'Design user interfaces and improve user experience',
                techStacks: ['15', '16'],
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Project updated successfully',
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        owner: {
          id: 'NLxTW4lMvMJSbEvpIShgtckD15cnbFVH',
          username: 'y2_znt',
          avatarUrl: 'https://avatars.githubusercontent.com/u/152095147?v=4',
        },
        title: 'Updated E-commerce Platform',
        description:
          'Enhanced e-commerce application with new features including AI-powered recommendations, advanced analytics, and improved user experience.',
        image: 'https://example.com/updated-project-logo.png',
        coverImages: [
          'https://example.com/cover-1.png',
          'https://example.com/cover-2.png',
          'https://example.com/cover-3.png',
        ],
        readme:
          '# Updated E-commerce Platform\n\nEnhanced features and improved architecture...',
        categories: [
          { id: '1', name: 'IA & Machine Learning' },
          { id: '4', name: 'Web Development' },
          { id: '6', name: 'E-commerce' },
        ],
        techStacks: [
          {
            id: '3',
            name: 'React',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
            type: 'TECH',
          },
          {
            id: '7',
            name: 'Node.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
            type: 'TECH',
          },
          {
            id: '9',
            name: 'TypeScript',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
            type: 'LANGUAGE',
          },
        ],
        keyFeatures: [
          {
            id: '107877b3-262b-44d0-8d84-5828d444872b',
            projectId: '123e4567-e89b-12d3-a456-426614174000',
            feature: 'AI-powered recommendations',
          },
          {
            id: '207877b3-262b-44d0-8d84-5828d444872b',
            projectId: '123e4567-e89b-12d3-a456-426614174000',
            feature: 'Advanced analytics dashboard',
          },
        ],
        projectRoles: [
          {
            id: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9',
            title: 'Senior Frontend Developer',
            description:
              'Lead frontend development with React, TypeScript, and modern state management',
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
            ],
          },
        ],
        externalLinks: [
          {
            id: '6c361ece-8e85-46b0-8888-d620c9b1f878',
            type: 'GITHUB',
            url: 'https://github.com/y2_znt/ecommerce-platform',
          },
          {
            id: 'd89809b3-fa85-4c0b-984f-1b1cf672a3a9',
            type: 'WEBSITE',
            url: 'https://ecommerce-platform.com',
          },
        ],
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-20T14:45:00.000Z',
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
              'categories must contain at least 1 element',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        invalidId: {
          summary: 'Invalid project ID',
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
        message: 'You do not have permission to update this project',
        statusCode: 403,
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
