import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

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
