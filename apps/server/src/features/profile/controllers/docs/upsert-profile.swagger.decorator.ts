import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UpsertProfileDto } from '../dto/upsert-profile.dto';

export function UpsertProfileDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({ summary: 'Create or update a user profile' }),
    ApiBody({
      type: UpsertProfileDto,
      description: 'Data to create or update a profile',
      examples: {
        a: {
          summary: 'Example 1',
          value: {
            bio: 'Software developer from France.',
            location: 'San Francisco, CA',
            company: 'Google',
            jobTitle: 'Software Engineer',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'The profile has been successfully created/updated.',
      example: {
        id: 'clv2l1f2b000008l6g1j2h3k4',
        userId: '',
        bio: 'Software developer from France.',
        location: 'San Francisco, CA',
        company: 'Google',
        jobTitle: 'Backend Developer',
        createdAt: '2025-09-06T10:00:00.000Z',
        updatedAt: '2025-09-06T10:00:00.000Z',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication',
      example: { statusCode: 401, message: 'Unauthorized' },
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
