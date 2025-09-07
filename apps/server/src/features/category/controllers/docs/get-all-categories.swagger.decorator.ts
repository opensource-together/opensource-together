import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetAllCategoriesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all categories',
      description: 'Return the list of all categories available for projects',
    }),
    ApiResponse({
      status: 200,
      description: 'List of all categories available',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            name: { type: 'string', example: 'Web Development' },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Server error when fetching categories',
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
