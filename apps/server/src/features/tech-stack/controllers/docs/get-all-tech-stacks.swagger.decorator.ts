import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetAllTechstacksDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all tech stacks',
      description:
        'Returns the list of all tech stacks separated by type (languages and technologies)',
    }),
    ApiResponse({
      status: 200,
      description: 'List of all tech stacks',
      schema: {
        type: 'object',
        properties: {
          languages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '9' },
                name: { type: 'string', example: 'TypeScript' },
                iconUrl: {
                  type: 'string',
                  example:
                    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
                },
                type: { type: 'string', example: 'LANGUAGE' },
              },
            },
          },
          technologies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1' },
                name: { type: 'string', example: 'React' },
                iconUrl: {
                  type: 'string',
                  example:
                    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
                },
                type: { type: 'string', example: 'TECH' },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Server error when fetching tech stacks',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Internal server error' },
          statusCode: { type: 'number', example: 500 },
        },
      },
    }),
  );
}
