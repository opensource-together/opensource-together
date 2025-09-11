import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function FindProjectByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get project by ID',
      description:
        'Retrieves detailed information about a specific project including owner details, technologies, roles, external links, and GitHub statistics.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the project',
      example: '123e4567-e89b-12d3-a456-426614174000',
      type: 'string',
      format: 'uuid',
    }),
    ApiResponse({
      status: 200,
      description: 'Project details retrieved successfully',
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        owner: {
          id: 'NLxTW4lMvMJSbEvpIShgtckD15cnbFVH',
          username: 'y2_znt',
          avatarUrl: 'https://avatars.githubusercontent.com/u/152095147?v=4',
        },
        title: 'E-commerce Platform',
        description:
          'Modern e-commerce application built with React, Node.js, and TypeScript. Features include real-time inventory management, payment processing, and responsive design.',
        image: 'https://example.com/project-logo.png',
        coverImages: [
          'https://example.com/cover-1.png',
          'https://example.com/cover-2.png',
        ],
        readme: '# E-commerce Platform\n\nA modern e-commerce solution...',
        categories: [
          { id: '1', name: 'IA & Machine Learning' },
          { id: '4', name: 'Web Development' },
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
            feature: 'Real-time inventory management',
          },
          {
            id: '207877b3-262b-44d0-8d84-5828d444872b',
            projectId: '123e4567-e89b-12d3-a456-426614174000',
            feature: 'Payment processing integration',
          },
        ],
        projectRoles: [
          {
            id: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9',
            title: 'Frontend Developer',
            description:
              'Build responsive UI components with React and TypeScript',
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
          {
            id: 'c7130a7c-09b4-46dd-8f5d-043938cf40b9',
            title: 'Backend Developer',
            description: 'Develop RESTful APIs and microservices with Node.js',
            techStacks: [
              {
                id: '7',
                name: 'Node.js',
                iconUrl:
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
                type: 'TECH',
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
          {
            id: 'e89809b3-fa85-4c0b-984f-1b1cf672a3a9',
            type: 'DISCORD',
            url: 'https://discord.gg/ecommerce-platform',
          },
        ],
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-20T14:45:00.000Z',
        stats: {
          stats: {
            forks: 15,
            stars: 42,
            watchers: 8,
            openIssues: 3,
          },
          contributors: [
            {
              login: 'y2_znt',
              avatar_url:
                'https://avatars.githubusercontent.com/u/152095147?v=4',
              html_url: 'https://github.com/y2_znt',
              contributions: 25,
            },
            {
              login: 'contributor2',
              avatar_url:
                'https://avatars.githubusercontent.com/u/123254210?v=4',
              html_url: 'https://github.com/contributor2',
              contributions: 12,
            },
          ],
          commits: {
            lastCommit: {
              sha: '4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
              message: 'feat: Add payment integration with Stripe',
              date: '2025-01-20T14:30:00Z',
              url: 'https://github.com/y2_znt/ecommerce-platform/commit/4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
              author: {
                login: 'y2_znt',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/152095147?v=4',
                html_url: 'https://github.com/y2_znt',
              },
            },
            commitsNumber: 47,
          },
        },
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
