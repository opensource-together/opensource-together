import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetProfileByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a user profile by ID',
      description:
        'Retrieves the complete profile information of a specific user by their profile ID. This endpoint is public and does not require authentication.',
    }),
    ApiResponse({
      status: 200,
      description: 'The complete profile of the user',
      example: {
        id: 'clv2l1f2b000008l6g1j2h3k4',
        username: 'janedoe_dev',
        avatarUrl: 'https://avatars.githubusercontent.com/u/987654321?v=4',
        provider: 'github',
        bio: 'Frontend developer specializing in Vue.js and TypeScript. Passionate about creating beautiful and performant user interfaces.',
        jobTitle: 'Frontend Developer',
        socialLinks: {
          github: 'https://github.com/janedoe',
          linkedin: 'https://linkedin.com/in/janedoe',
          twitter: 'https://x.com/janedoe',
          website: 'https://janedoe.dev',
        },
        techStacks: [
          {
            id: '5',
            name: 'Vue.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
            type: 'TECH',
          },
          {
            id: '2',
            name: 'TypeScript',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
            type: 'LANGUAGE',
          },
          {
            id: '6',
            name: 'Firebase',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg',
            type: 'TECH',
          },
          {
            id: '7',
            name: 'Tailwind CSS',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
            type: 'TECH',
          },
        ],
        projects: [],
        joinedAt: '2025-03-15T10:00:00.000Z',
        updatedAt: '2025-08-20T10:00:00.000Z',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profile not found',
      example: {
        statusCode: 404,
        message: 'Profile not found',
        error: 'Not Found',
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      example: { statusCode: 500, message: 'Internal server error' },
    }),
  );
}
