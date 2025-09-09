import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UpsertProfileDto } from '../dto/upsert-profile.dto';

export function UpdateProfileDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({ summary: 'Update the current user profile' }),
    ApiBody({
      type: UpsertProfileDto,
      description: 'Data to update a profile',
      examples: {
        default: {
          value: {
            bio: 'Software developer from France.',
            location: 'Paris, France',
            company: 'Startup Inc.',
            jobTitle: 'Senior Engineer',
            socialLinks: [{ name: 'twitter', url: 'https://x.com/johndoe' }],
            techStack: ['1', '2', '3'],
            experience: ['7 years in web development'],
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Profile updated successfully',
      example: {
        id: 'clv2l1f2b000008l6g1j2h3k4',
        userId: 'user-123',
        name: 'John Doe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123456789?v=4',
        bio: 'Updated bio with more context',
        location: 'Paris, France',
        company: 'Startup Inc.',
        jobTitle: 'Senior Engineer',
        socialLinks: [{ name: 'twitter', url: 'https://x.com/johndoe' }],
        techStack: ['Next.js', 'NestJS'],
        experience: ['7 years in web development'],
        projects: ['project-1', 'project-2'],
        joinedAt: '2025-01-01T10:00:00.000Z',
        createdAt: '2025-09-01T10:00:00.000Z',
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
