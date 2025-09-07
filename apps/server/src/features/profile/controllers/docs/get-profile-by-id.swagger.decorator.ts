import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
