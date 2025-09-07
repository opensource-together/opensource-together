import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function FindProjectByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Récupérer un projet par ID' }),
    ApiResponse({
      status: 200,
      description: 'Détails du projet',
      example: {
        id: 'e214183d-bf0a-4818-9050-17d4905de4e8',
        owner: {
          id: 'GCJO6PXIysuDms1Od6W8TefrigEamAeP',
          name: 'Lucalhost',
          githubLogin: 'Lhourquin',
          image: 'https://avatars.githubusercontent.com/u/45101981?v=4',
        },
        title: 'test',
        description: 'project de test',
        image: '',
        coverImages: [],
        readme: '',
        categories: [{ id: '1', name: 'IA & Machine Learning' }],
        techStacks: [
          {
            id: '2',
            name: 'Next.js',
            iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
            type: 'TECH',
          },
        ],
        projectRoles: [
          {
            id: 'e07b8ddb-7df8-451d-b8fb-141975e1f2ef',
            title: 'Frontend Developer',
            description: 'Développeur React expérimenté',
            techStacks: [
              {
                id: '2',
                name: 'Next.js',
                iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
                type: 'TECH',
              },
            ],
          },
        ],
        externalLinks: [],
        createdAt: '2025-08-31T10:36:15.264Z',
        updatedAt: '2025-08-31T10:36:15.264Z',
        stats: {
          forks: 0,
          stars: 0,
          watchers: 0,
          openIssues: 0,
          commits: 0,
          lastCommit: {
            sha: '922ec728733c4a11b08bc99cfcc2d402f33f5484',
            message: 'first commit',
            date: '2025-08-31T10:38:46Z',
            url: 'https://github.com/Lhourquin/test/commit/922ec728733c4a11b08bc99cfcc2d402f33f5484',
            author: {
              login: 'Lhourquin',
              avatar_url: 'https://avatars.githubusercontent.com/u/45101981?v=4',
              html_url: 'https://github.com/Lhourquin',
            },
          },
          contributors: [
            {
              login: 'Lhourquin',
              avatar_url: 'https://avatars.githubusercontent.com/u/45101981?v=4',
              html_url: 'https://github.com/Lhourquin',
              contributions: 2,
            },
          ],
        },
      },
    }),
  );
}
