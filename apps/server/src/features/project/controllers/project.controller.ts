import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  AuthGuard,
  Public,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';
import { GithubAuthGuard } from '@/features/github/controllers/guards/github-auth.guard';
import { Octokit } from '@octokit/rest';
import { GitHubOctokit } from '@/features/github/controllers/github-octokit.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les projets' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets',
    example: [
      {
        owner: {
          id: 'github_user123',
          username: 'Lhourquin',
          login: 'Lhourquin',
          avatarUrl: 'https://avatars.githubusercontent.com/u/123456789?v=4',
          email: 'lhourquin@example.com',
          provider: 'github',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
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
          username: 'Mac-Gyver',
          login: 'Mac-Gyver',
          avatarUrl: 'https://avatars.githubusercontent.com/u/123254210?v=4',
          email: 'macgyver@example.com',
          provider: 'github',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
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
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  @UseGuards(GithubAuthGuard)
  @Get()
  @Public()
  async getProjects() {
    const result = await this.projectService.getAll();
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }

  @ApiOperation({ summary: 'Créer un projet' })
  @UseGuards(GithubAuthGuard)
  @Post()
  async createProject(
    @Session() session: UserSession,
    @Body() createProjectDto: CreateProjectDto,
    @GitHubOctokit() octokit: Octokit,
  ) {
    console.log('session', session);
    console.log('session.user.id', session.user.id);
    // console.log('octokit', octokit);
    const userId = session.user.id;
    const { title, description, categories, techStacks } = createProjectDto;
    const result = await this.projectService.createProject(
      {
        ownerId: userId,
        title,
        description,
        categories,
        techStacks,
        projectRoles: createProjectDto.projectRoles || [],
      },
      octokit,
    );
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }
}
