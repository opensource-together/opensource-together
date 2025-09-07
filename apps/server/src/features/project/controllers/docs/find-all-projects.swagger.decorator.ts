import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindAllProjectsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all projects' }),
    ApiResponse({
      status: 200,
      description: 'Liste des projets',
      example: [
        {
          owner: {
            id: 'github_user123',
            name: 'Lhourquin',
            image: 'https://avatars.githubusercontent.com/u/123456789?v=4',
          },
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'E-commerce Platform',
          description: 'Modern e-commerce app with React',
          shortDescription: 'E-commerce with React & Node.js',
          ownerId: 'github_user123',
          techStacks: [
            {
              id: '1',
              name: 'React',
              iconUrl: 'https://reactjs.org/logo.svg',
              type: 'TECH',
            },
            {
              id: '2',
              name: 'Node.js',
              iconUrl: 'https://nodejs.org/logo.svg',
              type: 'TECH',
            },
          ],
          categories: [{ id: '2', name: 'Développement Web' }],
          keyFeatures: [
            {
              id: 'feature1',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              feature: 'Shopping Cart',
            },
          ],
          projectGoals: [
            {
              id: 'goal1',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              goal: 'Create smooth UX',
            },
          ],
          projectRoles: [
            {
              id: 'role1',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              title: 'Frontend Developer',
              description: 'React developer needed',
              isFilled: false,
              techStacks: [
                {
                  id: '1',
                  name: 'React',
                  iconUrl: 'https://reactjs.org/logo.svg',
                  type: 'TECH',
                },
              ],
              createdAt: '2025-01-15T10:30:00.000Z',
              updatedAt: '2025-01-15T10:30:00.000Z',
            },
          ],
          externalLinks: [
            { type: 'github', url: 'https://github.com/user/project' },
          ],
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
          projectStats: {
            forks: 2,
            stars: 1,
            watchers: 1,
            openIssues: 1,
            commits: 4,
            lastCommit: {
              sha: '4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
              message: 'Merge pull request #2 from Jyzdcs/main\n\ntest',
              date: '2025-07-15T23:17:16Z',
              url: 'https://github.com/Lhourquin/projet-os/commit/4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
              author: {
                login: 'Lhourquin',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/45101981?v=4',
                html_url: 'https://github.com/Lhourquin',
              },
            },
            contributors: [
              {
                login: 'Lhourquin',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/45101981?v=4',
                html_url: 'https://github.com/Lhourquin',
                contributions: 3,
              },
              {
                login: 'Jyzdcs',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/123254210?v=4',
                html_url: 'https://github.com/Jyzdcs',
                contributions: 1,
              },
            ],
          },
        },
        {
          owner: {
            id: 'github_user456',
            name: 'Mac-Gyver',
            image: 'https://avatars.githubusercontent.com/u/123254210?v=4',
          },
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'E-commerce Platform',
          description: 'Modern e-commerce app with React',
          shortDescription: 'E-commerce with React & Node.js',
          ownerId: 'github_user456',
          techStacks: [
            {
              id: '1',
              name: 'React',
              iconUrl: 'https://reactjs.org/logo.svg',
              type: 'TECH',
            },
            {
              id: '2',
              name: 'Node.js',
              iconUrl: 'https://nodejs.org/logo.svg',
              type: 'TECH',
            },
          ],
          categories: [{ id: '2', name: 'Développement Web' }],
          keyFeatures: [
            {
              id: 'feature1',
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              feature: 'Shopping Cart',
            },
          ],
          projectGoals: [
            {
              id: 'goal1',
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              goal: 'Create smooth UX',
            },
          ],
          projectRoles: [
            {
              id: 'role1',
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              title: 'Frontend Developer',
              description: 'React developer needed',
              isFilled: false,
              techStacks: [
                {
                  id: '1',
                  name: 'React',
                  iconUrl: 'https://reactjs.org/logo.svg',
                  type: 'TECH',
                },
              ],
              createdAt: '2025-01-15T10:30:00.000Z',
              updatedAt: '2025-01-15T10:30:00.000Z',
            },
          ],
          externalLinks: [
            { type: 'github', url: 'https://github.com/user/project' },
          ],
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
          projectStats: {
            forks: 2,
            stars: 1,
            watchers: 1,
            openIssues: 1,
            commits: 4,
            lastCommit: {
              sha: '4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
              message: 'Merge pull request #2 from Mac-Gyver/main\n\ntest',
              date: '2025-07-15T23:17:16Z',
              url: 'https://github.com/Mac-Gyver/projet-os/commit/4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
              author: {
                login: 'Mac-Gyver',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/45101981?v=4',
                html_url: 'https://github.com/Lhourquin',
              },
            },
            contributors: [
              {
                login: 'Mac-Gyver',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/123254210?v=4',
                html_url: 'https://github.com/Mac-Gyver',
                contributions: 3,
              },
              {
                login: 'Jyzdcs',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/123254210?v=4',
                html_url: 'https://github.com/Jyzdcs',
                contributions: 1,
              },
            ],
          },
        },
      ],
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
