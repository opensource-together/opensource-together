import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function FindMyProjectByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get my project by ID',
      description:
        'Retrieve a specific project owned by the currently authenticated user',
    }),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      type: 'string',
      example: '16bc4345-953a-487f-8824-08c5e93dbb1e',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved user project',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Project does not belong to user',
    }),
    ApiResponse({
      status: 404,
      description: 'Project not found',
    }),
  );
}
