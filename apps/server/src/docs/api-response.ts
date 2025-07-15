// docs/api-response.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const OkArray = (schema: any, description = 'OK') =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description,
      schema: { type: 'array', items: schema },
    }),
  );

export const NotFound = (description = 'Not found') =>
  ApiResponse({ status: 404, description });
