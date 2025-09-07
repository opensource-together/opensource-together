import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpsertProfileDto } from '../dto/upsert-profile.dto';

export function UpsertProfileDocs() {
  return applyDecorators(
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
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}

export function GetMyProfileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get the profile of the currently authenticated user',
    }),
    ApiResponse({
      status: 200,
      description: 'The complete profile of the user',
      example: {
        id: 'clv2l1f2b000008l6g1j2h3k4',
        name: 'John Doe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123456789?v=4',
        bio: 'Software developer from France.',
        location: 'Paris, France',
        company: 'Tech Corp',
        socialLinks: [{ name: 'github', url: 'https://github.com/johndoe' }],
        techStack: ['NestJS', 'React', 'PostgreSQL'],
        experience: ['5 years in backend development'],
        projects: ['project-1', 'project-2'],
        joinedAt: '2025-01-01T10:00:00.000Z',
        updatedAt: '2025-09-06T10:00:00.000Z',
      },
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}

export function GetProfileByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a user profile by ID' }),
    ApiResponse({
      status: 200,
      description: 'The complete profile of the user',
      example: {
        id: 'clv2l1f2b000008l6g1j2h3k4',
        name: 'Jane Doe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/987654321?v=4',
        bio: 'Frontend developer from Spain.',
        location: 'Madrid, Spain',
        company: 'Web Solutions',
        socialLinks: [
          { name: 'linkedin', url: 'https://linkedin.com/in/janedoe' },
        ],
        techStack: ['Vue.js', 'TypeScript', 'Firebase'],
        experience: ['3 years in frontend development'],
        projects: ['project-3', 'project-4'],
        joinedAt: '2025-03-15T10:00:00.000Z',
        updatedAt: '2025-08-20T10:00:00.000Z',
      },
    }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
  );
}

export function DeleteProfileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete the profile of the currently authenticated user',
    }),
    ApiResponse({
      status: 200,
      description: 'The profile has been successfully deleted',
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
