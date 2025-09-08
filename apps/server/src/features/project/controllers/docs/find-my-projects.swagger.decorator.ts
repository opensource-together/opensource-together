import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindMyProjectsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get current user projects',
      description:
        'Retrieve all projects owned by the currently authenticated user',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved user projects',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            coverImages: { type: 'array', items: { type: 'string' } },
            readme: { type: 'string' },
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
            techStacks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  iconUrl: { type: 'string' },
                  type: { type: 'string' },
                },
              },
            },
            projectRoles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  techStacks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        iconUrl: { type: 'string' },
                        type: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
            externalLinks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: {
                    type: 'string',
                    enum: ['GITHUB', 'TWITTER', 'LINKEDIN', 'WEBSITE'],
                  },
                  url: { type: 'string' },
                },
              },
            },
            owner: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                githubLogin: { type: 'string' },
                image: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            projectStats: {
              type: 'object',
              properties: {
                stars: { type: 'number' },
                forks: { type: 'number' },
                watchers: { type: 'number' },
                openIssues: { type: 'number' },
                commits: { type: 'number' },
                contributors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      username: { type: 'string' },
                      avatarUrl: { type: 'string' },
                      contributions: { type: 'number' },
                    },
                  },
                },
                lastCommit: {
                  type: 'object',
                  properties: {
                    sha: { type: 'string' },
                    message: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    url: { type: 'string' },
                    author: {
                      type: 'object',
                      properties: {
                        login: { type: 'string' },
                        avatar_url: { type: 'string' },
                        html_url: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid parameters',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
        },
      },
    }),
  );
}
