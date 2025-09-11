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
    ApiOperation({
      summary: 'Update the current user profile',
      description:
        'Updates the profile of the currently authenticated user. Supports updating username, bio, job title, tech stacks, and social links.',
    }),
    ApiBody({
      type: UpsertProfileDto,
      description: 'Data to update a profile',
      examples: {
        complete: {
          summary: 'Complete profile update',
          value: {
            username: 'johndoe_dev',
            bio: 'Full-stack developer passionate about React and Node.js. Building amazing web applications with modern technologies.',
            jobTitle: 'Senior Full-Stack Developer',
            techStacks: ['1', '2', '3', '4'],
            socialLinks: {
              github: 'https://github.com/johndoe',
              twitter: 'https://x.com/johndoe',
              linkedin: 'https://linkedin.com/in/johndoe',
              discord: 'https://discord.gg/johndoe',
              website: 'https://johndoe.dev',
            },
          },
        },
        minimal: {
          summary: 'Minimal profile update',
          value: {
            username: 'jane_doe',
            bio: 'Frontend developer specializing in React and TypeScript.',
          },
        },
        socialLinks: {
          summary: 'Update social links only',
          value: {
            username: 'johndoe_dev',
            socialLinks: {
              github: 'https://github.com/johndoe',
              twitter: 'https://x.com/johndoe',
              linkedin: 'https://linkedin.com/in/johndoe',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Profile updated successfully',
      example: {
        id: 'clv2l1f2b000008l6g1j2h3k4',
        username: 'johndoe_dev',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123456789?v=4',
        provider: 'github',
        bio: 'Full-stack developer passionate about React and Node.js. Building amazing web applications with modern technologies.',
        jobTitle: 'Senior Full-Stack Developer',
        socialLinks: {
          github: 'https://github.com/johndoe',
          twitter: 'https://x.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe',
          discord: 'https://discord.gg/johndoe',
          website: 'https://johndoe.dev',
        },
        techStacks: [
          {
            id: '1',
            name: 'React',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
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
            id: '3',
            name: 'Node.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
            type: 'TECH',
          },
          {
            id: '4',
            name: 'PostgreSQL',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
            type: 'TECH',
          },
        ],
        projects: [],
        joinedAt: '2025-01-01T10:00:00.000Z',
        updatedAt: '2025-09-10T22:00:00.000Z',
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation error',
      example: {
        statusCode: 400,
        message: [
          'username should not be empty',
          'bio must be shorter than or equal to 500 characters',
          'socialLinks.github must be a valid URL',
        ],
        error: 'Bad Request',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication',
      example: { statusCode: 401, message: 'Unauthorized' },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      example: { statusCode: 500, message: 'Internal server error' },
    }),
  );
}
