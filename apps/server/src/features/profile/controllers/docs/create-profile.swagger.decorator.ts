import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UpsertProfileDto } from '../dto/upsert-profile.dto';

export function CreateProfileDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({ summary: 'Create a user profile' }),
    ApiBody({
      type: UpsertProfileDto,
      description: 'Data to create a profile',
      examples: {
        default: {
          value: {
            bio: 'Software developer from France.',
            location: 'Paris, France',
            company: 'Google',
            jobTitle: 'Software Engineer',
            socialLinks: [
              { name: 'github', url: 'https://github.com/johndoe' },
              { name: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
            ],
            techStack: ['1', '2', '3'],
            experience: ['5 years in backend development'],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Profile created successfully',
      example: {
        id: 'clv2l1f2b000008l6g1j2h3k4',
        userId: 'user-123',
        name: 'John Doe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123456789?v=4',
        bio: 'Software developer from France.',
        location: 'San Francisco, CA',
        company: 'Google',
        jobTitle: 'Backend Developer',
        socialLinks: [{ name: 'github', url: 'https://github.com/johndoe' }],
        techStack: ['NestJS', 'React', 'PostgreSQL'],
        experience: ['5 years in backend development'],
        projects: ['project-1', 'project-2'],
        joinedAt: '2025-01-01T10:00:00.000Z',
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
